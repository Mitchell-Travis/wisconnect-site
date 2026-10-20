"""Inquiry follow-up checks in a disposable schema; no external mail."""
import json
import os
import secrets
import socket
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from uuid import uuid4
from sqlalchemy import create_engine, select, text, func
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session
from .app.auth import DUMMY_HASH, digest, now
from .app.database import DATABASE_URL
from .app.models import ContactInquiry, InquiryEvent, LoginSession, User


def main():
    schema='inquiry_followup_check_'+secrets.token_hex(6)
    base=create_engine(DATABASE_URL)
    with base.begin() as connection: connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    url=make_url(DATABASE_URL).update_query_dict({'options':f'-csearch_path={schema}'})
    engine=create_engine(url)
    env=dict(os.environ,DATABASE_URL=url.render_as_string(hide_password=False),WISCONNECT_LOCAL_AUTH='1',WISCONNECT_CONTACT_MAIL_MODE='disabled')
    process=None;log=tempfile.TemporaryFile();cookies={};ids={}
    try:
        subprocess.run([sys.executable,'-m','alembic','-c','backend/alembic.ini','upgrade','0008_businesses'],env=env,check=True)
        with engine.begin() as connection:
            connection.execute(text("INSERT INTO contact_inquiries (submission_id,name,email,topic,message,created_at,email_status,email_mode) VALUES (:key,'Legacy visitor','visitor@example.test','Partnerships','Original message',now()-interval '1 day','failed','local')"), {'key':str(uuid4())})
        subprocess.run([sys.executable,'-m','alembic','-c','backend/alembic.ini','upgrade','head'],env=env,check=True)
        with Session(engine) as db:
            for role in ['admin','other','member','inactive']:
                user=User(name=role,email=role+'@example.test',password_hash=DUMMY_HASH,role='member' if role=='member' else 'admin',active=role!='inactive')
                db.add(user);db.flush();ids[role]=user.id
                token=secrets.token_urlsafe(32);cookies[role]='wisconnect_local_session='+token
                db.add(LoginSession(token_hash=digest(token),user_id=user.id,expires_at=now()+timedelta(hours=1)))
            db.commit()
        with socket.socket() as sock: sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
        process=subprocess.Popen([sys.executable,'-m','uvicorn','backend.app.main:app','--host','127.0.0.1','--port',str(port),'--no-access-log','--no-proxy-headers'],env=env,stdout=log,stderr=log)
        def request(path,body=None,role=None,method=None,origin='http://localhost:3000'):
            headers={'Content-Type':'application/json','Origin':origin,'X-WisConnect-Request':'1'}
            if role: headers['Cookie']=cookies[role]
            try:
                response=urlopen(Request(f'http://127.0.0.1:{port}'+path,headers=headers,method=method or ('POST' if body is not None else 'GET'),data=json.dumps(body,ensure_ascii=False).encode() if body is not None else None),timeout=15)
            except HTTPError as error: response=error
            with response:
                raw=response.read();return response.status,json.loads(raw) if raw else None,response.headers
        for _ in range(100):
            try:
                if request('/health')[0]==200:break
            except URLError:time.sleep(.1)
        else:raise AssertionError('API did not start')
        today=now().date()
        with Session(engine) as db:
            for n in range(28):
                db.add(ContactInquiry(submission_id=str(uuid4()),name=f'Test inquiry {n}',email='visitor@example.test',topic='Partnerships',message='Original message',created_at=now(),email_status='sent' if n%2 else 'failed',email_mode='local'))
            db.commit()
            inquiry_id=db.scalar(select(ContactInquiry.id).order_by(ContactInquiry.id))
        path=f'/auth/contact-inquiries/{inquiry_id}'
        for route in ['/auth/contact-inquiries','/auth/contact-inquiries/assignees',path,path+'/activity']:
            assert request(route)[0]==401 and request(route,role='member')[0]==403 and request(route,role='inactive')[0]==401
        legacy=request(path,role='admin')[1]
        assert legacy['status']=='open' and legacy['updated_at']==legacy['created_at'] and legacy['version']==0 and legacy['message']=='Original message'
        assert request(path+'/activity',role='admin')[1]['items'][0]['summary']=='Inquiry received; follow-up tracking added'
        assert len(request('/auth/contact-inquiries/assignees',role='admin')[1])==2
        first=request('/auth/contact-inquiries',role='admin')[1]
        second=request('/auth/contact-inquiries?before='+str(first['next_cursor']),role='admin')[1]
        assert first['total']==29 and len(first['items'])==25 and len(second['items'])==4
        assert not ({r['id'] for r in first['items']} & {r['id'] for r in second['items']})
        data={'request_id':str(uuid4()),'version':0,'status':'in_progress','assignee_id':ids['admin'],'follow_up_on':today.isoformat(),'note':'Private follow-up note'}
        assert request(path,data,'member',method='PATCH')[0]==403
        assert request(path,data,'admin',method='PATCH',origin='https://untrusted.test')[0]==403
        for change in [{'status':'sent'},{'assignee_id':ids['member']},{'assignee_id':ids['inactive']},{'version':True},{'follow_up_on':'2026-02-30'},{'follow_up_on':123456789},{'note':'x'*2001},{'email':'changed@example.test'}]:
            assert request(path,{**data,**change},'admin',method='PATCH')[0]==422,change
        with ThreadPoolExecutor(max_workers=2) as pool:
            result=list(pool.map(lambda _:request(path,data,'admin',method='PATCH'),range(2)))
        assert all(r[0]==200 and r[1]['version']==1 for r in result),result
        saved=result[0][1]
        assert saved['message']=='Original message' and saved['email_status']=='failed' and saved['assignee_name']=='admin'
        assert request(path,{**data,'note':'different'},'admin',method='PATCH')[0]==409
        assert request(path,data,'other',method='PATCH')[0]==409
        assert request(path,{**data,'request_id':str(uuid4())},'other',method='PATCH')[0]==409
        def listing(query,role='admin'):return request('/auth/contact-inquiries?'+query,role=role)[1]
        assert listing('assignment=mine')['total']==1 and listing('assignment=mine','other')['total']==0
        assert listing('due=due')['total']==1 and listing('due=overdue')['total']==0
        assert listing('assignment=unassigned')['total']==28 and listing('due=unscheduled')['total']==28
        assert listing('delivery=sent')['total']==14 and listing('delivery=failed')['total']==15
        assert listing('delivery=failed&status=in_progress')['total']==1
        assert listing('q=%25')['total']==0 and listing('q=visitor')['total']==29
        stats=request('/auth/overview',role='admin')[1]
        assert stats['contact_inquiries']==29 and stats['active_inquiries']==29 and stats['due_inquiries']==1
        close={**data,'version':1,'request_id':str(uuid4()),'status':'closed','note':'Follow-up completed'}
        assert request(path,close,'admin',method='PATCH')[0]==200
        assert listing('status=closed')['total']==1 and listing('status=active')['total']==28 and listing('due=due')['total']==0
        assert request('/auth/overview',role='admin')[1]['due_inquiries']==0
        reopen={**data,'version':2,'request_id':str(uuid4()),'status':'open','follow_up_on':(today-timedelta(days=1)).isoformat(),'assignee_id':ids['other'],'note':''}
        assert request(path,reopen,'admin',method='PATCH')[0]==200
        assert listing('due=overdue')['total']==1 and listing('assignment=mine','other')['total']==1
        # A notification retry cannot mark the inquiry answered or alter the workflow version.
        retried=request(path+'/retry-email',{},'admin')[1]
        assert retried['status']=='open' and retried['version']==3 and retried['email_status']=='failed'
        assert retried['follow_up_on']==reopen['follow_up_on'] and retried['assignee_id']==ids['other']
        history=request(path+'/activity',role='admin')[1]['items']
        assert len(history)==4 and sum(item['note']=='Private follow-up note' for item in history)==1
        assert 'Closed' in history[1]['summary'] and 'Open' in history[0]['summary']
        # Public intake returns only receipt fields; never private follow-up fields/history.
        receipt=request('/contact',{'submission_id':str(uuid4()),'name':'Public sample','email':'sample@example.test','message':'Hello'})
        assert receipt[0]==201 and set(receipt[1])=={'received','reference','test_mode'}
        newpath='/auth/contact-inquiries/'+str(receipt[1]['reference'])
        assert request(newpath,role='admin')[1]['status']=='open'
        assert request(newpath+'/activity',role='admin')[1]['items'][0]['summary']=='Inquiry received'
        unicode_note={**data,'request_id':str(uuid4()),'version':0,'status':'open','note':'🟣'*2000}
        assert request(newpath,unicode_note,'admin',method='PATCH')[0]==200
        assert request(newpath,{**unicode_note,'note':'x'*17000},'admin',method='PATCH')[0]==413
        with Session(engine) as db:
            for n in range(27):db.add(InquiryEvent(inquiry_id=inquiry_id,actor_name='Sample administrator',summary='History check',note='Private note',created_at=now()))
            db.commit()
        page=request(path+'/activity',role='admin')[1]
        older=request(path+'/activity?before='+str(page['next_cursor']),role='admin')[1]
        assert len(page['items'])==25 and len(older['items'])==6 and older['next_cursor'] is None
        assert not ({e['id'] for e in page['items']} & {e['id'] for e in older['items']})
        assert request('/auth/contact-inquiries/999999',role='admin')[0]==404
        print('PASS: inquiry permissions, validation, ownership, idempotent/concurrent saves, stale conflicts, status/date/assignment/delivery filters, accurate overview counts, private history pagination, public receipt privacy and notification/follow-up independence. No external email.')
    finally:
        if process:process.terminate();process.wait(timeout=10)
        log.close();engine.dispose()
        with base.begin() as connection:connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()

if __name__ == '__main__': main()
