"""Application invitation handoff checks; isolated schema and owned Mailpit messages only."""
import json
import re
from unittest.mock import patch
from fastapi import HTTPException
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
from .app.applications import InviteInput, invite_application
from .app.database import DATABASE_URL
from .app.models import Introduction, IntroductionEvent, Invitation, LoginSession, User


def main():
    schema='application_invite_check_'+secrets.token_hex(6)
    base=create_engine(DATABASE_URL)
    with base.begin() as connection: connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    url=make_url(DATABASE_URL).update_query_dict({'options':f'-csearch_path={schema}'})
    engine=create_engine(url)
    env=dict(os.environ,DATABASE_URL=url.render_as_string(hide_password=False),WISCONNECT_LOCAL_AUTH='1')
    process=None;log=tempfile.TemporaryFile();cookies={};ids={}
    suffix=secrets.token_hex(8)
    recipient=f'handoff-{suffix}@example.test'
    def mail(path,body=None,method='GET'):
        req=Request('http://127.0.0.1:8025/api/v1'+path,method=method,data=json.dumps(body).encode() if body else None,headers={'Content-Type':'application/json'})
        with urlopen(req,timeout=5) as response:
            raw=response.read();return json.loads(raw) if raw and method=='GET' else None
    def owned_messages():
        found=[]
        for row in mail('/messages?limit=500')['messages']:
            detail=mail('/message/'+row['ID'])
            if suffix in json.dumps(detail):found.append((row['ID'],detail))
        return found
    def token_for(email):
        for _,message in owned_messages():
            if email in json.dumps(message):
                match=re.search(r'token=([A-Za-z0-9_-]+)',message['Text'])
                if match:return match.group(1)
        raise AssertionError('No owned invitation message found')
    try:
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
        def application(email):
            result=request('/introductions',{'submission_id':str(uuid4()),'name':'Sample applicant','email':email,'location':'Sample location','expertise':'Private application expertise','contribution':'Private application contribution'})
            assert result[0]==201
            return '/auth/applications/'+str(result[1]['reference'])
        path=application(recipient)
        body={'version':0,'request_id':str(uuid4())}
        assert request(path+'/invite',body)[0]==401 and request(path+'/invite',body,'member')[0]==403
        assert request(path+'/invite',body,'inactive')[0]==401
        assert request(path+'/invite',body,'admin',origin='https://untrusted.test')[0]==403
        assert request(path+'/invite',{**body,'email':'different@example.test'},'admin')[0]==422
        assert request(path+'/invite',{**body,'version':100},'admin')[0]==409
        with ThreadPoolExecutor(max_workers=2) as pool: sent=list(pool.map(lambda _:request(path+'/invite',body,'admin'),range(2)))
        assert all(x[0]==200 for x in sent),sent
        detail=sent[0][1];inv=detail['account_access']['invitation'];first_id=inv['id']
        assert detail['version']==1 and detail['status']=='new' and not detail['account_access']['account_exists']
        assert inv['source_application_id']==detail['id'] and inv['status']=='pending'
        assert not any(key in json.dumps(detail) for key in ['token_hash','request_id'])
        assert len(owned_messages())==1
        message=owned_messages()[0][1]['Text']
        assert 'does not confirm cooperative membership' in message and 'Private application' not in message
        assert request('/auth/invitations',{'email':recipient},'admin')[0]==409
        second_path=application(recipient)
        assert request(second_path+'/invite',{'version':0,'request_id':str(uuid4())},'admin')[0]==409
        assert request(second_path+'/invite',body,'admin')[0]==409
        assert request(path+'/invite',body,'other')[0]==409
        assert request(path+'/invite',{**body,'version':1},'admin')[0]==409
        token=token_for(recipient)
        assert request('/auth/invitation',{'token':token})[0]==200
        assert request('/auth/invitations/'+str(first_id),role='admin',method='DELETE')[0]==204
        assert request('/auth/invitations/'+str(first_id),role='admin',method='DELETE')[0]==204
        assert request('/auth/invitation',{'token':token})[0]==400
        detail=request(path,role='admin')[1]
        assert detail['version']==2 and detail['account_access']['invitation']['status']=='revoked'
        second_body={'version':2,'request_id':str(uuid4())}
        second=request(path+'/invite',second_body,'admin')[1]
        second_id=second['account_access']['invitation']['id'];assert second_id!=first_id and second['version']==3
        with Session(engine) as db:
            db.get(Invitation,second_id).expires_at=now()-timedelta(seconds=1);db.commit()
        assert request('/auth/invitation',{'token':token_for(recipient)})[0]==400
        assert request(path,role='admin')[1]['account_access']['invitation']['status']=='expired'
        third_body={'version':3,'request_id':str(uuid4())}
        third=request(path+'/invite',third_body,'admin')[1]
        third_id=third['account_access']['invitation']['id'];assert third_id not in [first_id,second_id]
        accept={'token':token_for(recipient),'name':'Sample accepted account','password':secrets.token_urlsafe(24)}
        with ThreadPoolExecutor(max_workers=2) as pool: accepted=list(pool.map(lambda _:request('/auth/accept',accept),range(2)))
        assert sorted(x[0] for x in accepted)==[201,400]
        detail=request(path,role='admin')[1]
        assert detail['version']==5 and detail['status']=='new' and detail['account_access']['account_exists']
        assert detail['account_access']['invitation']['status']=='used'
        assert request(path+'/invite',third_body,'admin')[0]==200 # lost-response retry never sends again
        assert request(path+'/invite',{'version':5,'request_id':str(uuid4())},'admin')[0]==409
        assert request('/auth/invitations/'+str(third_id),role='admin',method='DELETE')[0]==409
        assert len(owned_messages())==3
        history=request(path+'/activity',role='admin')[1]['items']
        assert sum('accepted;' in x['summary'] for x in history)==1 and sum('revoked' in x['summary'] for x in history)==1
        with Session(engine) as db:
            account=db.scalar(select(User).where(User.email==recipient));assert account.role=='member'
            rows=list(db.scalars(select(Invitation).where(Invitation.email==recipient).order_by(Invitation.id)))
            assert len(rows)==3 and rows[0].revoked_at and rows[1].expires_at<now() and rows[2].used_at
        race_email=f'race-{suffix}@example.test';race_path=application(race_email)
        with ThreadPoolExecutor(max_workers=2) as pool:
            a=pool.submit(request,race_path+'/invite',{'version':0,'request_id':str(uuid4())},'admin')
            b=pool.submit(request,'/auth/invitations',{'email':race_email},'other')
            statuses=sorted([a.result()[0],b.result()[0]])
        assert statuses in [[200,409],[201,409]],statuses
        with Session(engine) as db: assert db.scalar(select(func.count()).select_from(Invitation).where(Invitation.email==race_email))==1
        # Failed local SMTP must roll back the invitation, application version and history.
        fail_email=f'failure-{suffix}@example.test';fail_path=application(fail_email);fail_id=int(fail_path.rsplit('/',1)[1]);retry_body=InviteInput(version=0,request_id=uuid4())
        with Session(engine) as db, patch('backend.app.auth.smtplib.SMTP',side_effect=OSError('Synthetic outage')), patch('backend.app.applications.throttle'):
            try:invite_application(fail_id,retry_body,db.get(User,ids['admin']),db)
            except HTTPException as error:assert error.status_code==503
            else:raise AssertionError('Expected SMTP failure')
        with Session(engine) as db:
            assert db.scalar(select(Invitation).where(Invitation.email==fail_email)) is None
            assert db.get(Introduction,fail_id).version==0
            assert db.scalar(select(func.count()).select_from(IntroductionEvent).where(IntroductionEvent.introduction_id==fail_id))==1
        assert request(fail_path+'/invite',retry_body.model_dump(mode='json'),'admin')[0]==200
        print('PASS: explicit application invitation, immutable generations, private fields, admin/CSRF/version gates, cross-entry duplicate prevention, idempotent/concurrent sends, revoke/expire/resend, single-use acceptance, linked history, SMTP rollback and unchanged membership review. Local Mailpit only.')
    finally:
        if process:process.terminate();process.wait(timeout=10)
        log.close();engine.dispose()
        with base.begin() as connection:connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()
        owned=owned_messages()
        if owned:mail('/messages',{'IDs':[key for key,_ in owned]},'DELETE')

if __name__=='__main__':main()
