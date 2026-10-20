"""Introduction/review checks in a disposable PostgreSQL schema; no emails sent."""
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
from sqlalchemy import create_engine, func, select, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session
from .app.auth import DUMMY_HASH, digest, now
from .app.database import DATABASE_URL
from .app.models import Introduction, IntroductionEvent, LoginSession, User


def main():
    schema='applications_check_'+secrets.token_hex(6)
    base=create_engine(DATABASE_URL)
    with base.begin() as connection: connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    url=make_url(DATABASE_URL).update_query_dict({'options':f'-csearch_path={schema}'})
    engine=create_engine(url)
    env=dict(os.environ,DATABASE_URL=url.render_as_string(hide_password=False),WISCONNECT_LOCAL_AUTH='1')
    process=None;log=tempfile.TemporaryFile();cookies={};ids={}
    try:
        subprocess.run([sys.executable,'-m','alembic','-c','backend/alembic.ini','upgrade','head'],env=env,check=True)
        with Session(engine) as db:
            for role in ['admin','other','member','inactive']:
                user=User(name=role.title(),email=role+'@example.test',password_hash=DUMMY_HASH,role='member' if role=='member' else 'admin',active=role!='inactive')
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
        body={'submission_id':str(uuid4()),'name':'  Review Example  ','email':' Review@Example.test ','location':'Chicago','expertise':'Food business','contribution':'Mentoring'}
        rejected=request('/introductions',body,origin='https://bad.example')
        assert rejected[0]==403 and rejected[2]['Cache-Control']=='no-store'
        oversized=request('/introductions',{**body,'expertise':'x'*20481})
        assert oversized[0]==413 and oversized[2]['Cache-Control']=='no-store'
        assert oversized[2]['Referrer-Policy']=='no-referrer' and oversized[2]['X-Content-Type-Options']=='nosniff'
        for field,value in [('name',' '),('expertise','x'*1201),('contribution','\x00'),('email','bad')]:
            assert request('/introductions',{**body,field:value})[0]==422
        assert request('/introductions',{**body,'status':'approved'})[0]==422
        status,saved,headers=request('/introductions',body)
        assert status==201 and saved['received'] and headers['Cache-Control']=='no-store'
        assert set(saved)=={'received','reference'}
        assert request('/introductions',body)[1]==saved
        assert request('/introductions',{**body,'location':'Liberia'})[0]==409
        parallel={**body,'submission_id':str(uuid4())}
        with ThreadPoolExecutor(max_workers=2) as pool: results=list(pool.map(lambda _:request('/introductions',parallel),range(2)))
        assert all(r[0]==201 for r in results) and results[0][1]==results[1][1]
        endpoint=f'/auth/applications/{saved["reference"]}'
        for path in ['/auth/applications','/auth/applications/reviewers',endpoint,endpoint+'/activity']:
            assert request(path)[0]==401 and request(path,role='member')[0]==403 and request(path,role='inactive')[0]==401
        assert len(request('/auth/applications/reviewers',role='admin')[1])==2
        row=request(endpoint,role='admin')[1]
        assert row['email']=='review@example.test' and row['name']=='Review Example' and row['status']=='new' and len(row['activity']['items'])==1
        change={'request_id':str(uuid4()),'version':0,'status':'reviewing','reviewer_id':ids['other'],'note':'Follow up on services.'}
        assert request(endpoint,change,role='member',method='PATCH')[0]==403
        for extra in [{'status':'approved'},{'reviewer_id':ids['member']},{'reviewer_id':ids['inactive']},{'note':'x'*2001},{'version':True}]:
            assert request(endpoint,{**change,**extra},role='admin',method='PATCH')[0]==422
        reviewed=request(endpoint,change,role='admin',method='PATCH')
        assert reviewed[0]==200 and reviewed[1]['version']==1 and reviewed[1]['reviewer_name']=='Other'
        assert request(endpoint,change,role='admin',method='PATCH')[1]['version']==1
        assert request(endpoint,{**change,'note':'Changed retry'},role='admin',method='PATCH')[0]==409
        assert request(endpoint,{**change,'request_id':str(uuid4())},role='admin',method='PATCH')[0]==409
        assert request('/auth/applications?assignment=mine',role='other')[1]['total']==1
        assert request('/auth/applications?status=new',role='admin')[1]['total']==1
        assert request('/auth/applications?q=%25',role='admin')[1]['total']==0
        assert request('/auth/applications?q=review',role='admin')[1]['total']==2
        competing=[{**change,'version':1,'request_id':str(uuid4()),'status':'waiting','note':'Follow-up A'}, {**change,'version':1,'request_id':str(uuid4()),'status':'new','note':'Follow-up B'}]
        with ThreadPoolExecutor(max_workers=2) as pool: results=list(pool.map(lambda b:request(endpoint,b,role='admin',method='PATCH'),competing))
        assert sorted(r[0] for r in results)==[200,409]
        retry_change={**change,'version':2,'request_id':str(uuid4()),'status':'waiting','note':'One note only'}
        with ThreadPoolExecutor(max_workers=2) as pool: results=list(pool.map(lambda _:request(endpoint,retry_change,role='admin',method='PATCH'),range(2)))
        assert all(r[0]==200 and r[1]['version']==3 for r in results)
        with Session(engine) as db:
            assert db.scalar(select(func.count()).select_from(User))==4
            assert db.scalar(select(func.count()).select_from(Introduction))==2
            assert db.scalar(select(func.count()).select_from(IntroductionEvent).where(IntroductionEvent.request_id==retry_change['request_id']))==1
            # Enough real records/history to exercise both pagination paths.
            for i in range(26):
                db.add(Introduction(submission_id=str(uuid4()),name=f'Page {i}',email=f'page{i}@example.test',location='Liberia',expertise='Enterprise',contribution='Skills',created_at=now(),updated_at=now()))
                db.add(IntroductionEvent(introduction_id=saved['reference'],actor_name='Admin',summary='Test history',note='Private note',created_at=now()))
            db.commit()
        first=request('/auth/applications',role='admin')[1];second=request('/auth/applications?page=2',role='admin')[1]
        assert first['total']==28 and len(first['items'])==25 and len(second['items'])==3
        assert not {r['id'] for r in first['items']}&{r['id'] for r in second['items']}
        events=request(endpoint+'/activity',role='admin')[1];older=request(endpoint+'/activity?before='+str(events['next_cursor']),role='admin')[1]
        assert len(events['items'])==25 and older['items'] and not {r['id'] for r in events['items']}&{r['id'] for r in older['items']}
        assert request('/auth/applications/999999',role='admin')[0]==404
        # Native multilingual answers within field limits fit the request body limit.
        assert request('/introductions',{**body,'submission_id':str(uuid4()),'expertise':'🌍'*1200,'contribution':'🌍'*1200})[0]==201
        # Exhaust public intake rate limit without affecting saved retries.
        for _ in range(9): last=request('/introductions',{**body,'submission_id':str(uuid4())})
        assert last[0]==429 and request('/introductions',body)[1]==saved
        print('PASS: migrations, intake validation/origin/privacy, durable idempotent/concurrent submissions, admin-only review, assignment/filter/pagination, audit notes, stale-write conflicts, idempotent concurrent reviews, Unicode, throttling; no membership/account changes.')
    except BaseException:
        log.seek(0);print(log.read().decode()[-6000:]);raise
    finally:
        if process:process.terminate();process.wait(timeout=10)
        log.close();engine.dispose()
        with base.begin() as connection:connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()

if __name__=='__main__':main()
