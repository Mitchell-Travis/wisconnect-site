"""Account foundation integration checks in an owned disposable PostgreSQL schema."""
import json
import os
import re
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
from unittest.mock import patch
from sqlalchemy import create_engine, select, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session
from starlette.requests import Request as AppRequest
from .app.auth import digest, now, password_hash
from .app.accounts import request_reset
from .app.auth import EmailInput
from .app.database import DATABASE_URL
from .app.models import User, PasswordReset, LoginSession, AccountEvent, Invitation, ContactInquiry


def main():
    suffix = secrets.token_hex(6)
    schema = 'foundation_check_' + suffix
    base = create_engine(DATABASE_URL)
    with base.begin() as connection:
        connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    url = make_url(DATABASE_URL).update_query_dict({'options': f'-csearch_path={schema}'})
    engine = create_engine(url)
    environment = dict(os.environ, DATABASE_URL=url.render_as_string(hide_password=False), WISCONNECT_LOCAL_AUTH='1')
    process = None
    log = tempfile.TemporaryFile()
    password = secrets.token_urlsafe(24)
    new_password = secrets.token_urlsafe(24)
    emails = {role: f'{role}-{suffix}@example.test' for role in ['admin', 'member', 'other', 'unknown']}
    cookies, ids = {}, {}
    def mail(path, method='GET', body=None):
        with urlopen(Request('http://127.0.0.1:8025/api/v1'+path, method=method, data=json.dumps(body).encode() if body else None, headers={'Content-Type':'application/json'}), timeout=5) as response:
            raw = response.read()
            return json.loads(raw) if raw and method == 'GET' else None
    try:
        subprocess.run([sys.executable, '-m', 'alembic', '-c', 'backend/alembic.ini', 'upgrade', 'head'], env=environment, check=True)
        hashed = password_hash(password)
        with Session(engine) as db:
            for key in ['admin', 'member', 'other']:
                user = User(email=emails[key], name=key.title()+' Example', role='admin' if key=='admin' else 'member', password_hash=hashed)
                db.add(user); db.flush(); ids[key]=user.id
                secret=secrets.token_urlsafe(32)
                db.add(LoginSession(token_hash=digest(secret), user_id=user.id, expires_at=now()+timedelta(hours=1)))
                cookies[key]='wisconnect_local_session='+secret
            db.commit()
        with socket.socket() as sock:
            sock.bind(('127.0.0.1',0)); port=sock.getsockname()[1]
        process=subprocess.Popen([sys.executable,'-m','uvicorn','backend.app.main:app','--host','127.0.0.1','--port',str(port),'--no-access-log','--no-proxy-headers'],env=environment,stdout=log,stderr=log)
        def request(path, body=None, role=None, method=None, origin='http://localhost:3000'):
            headers={'Content-Type':'application/json','Origin':origin,'X-WisConnect-Request':'1'}
            if role: headers['Cookie']=cookies[role]
            try:
                response=urlopen(Request(f'http://127.0.0.1:{port}'+path, data=json.dumps(body).encode() if body is not None else None, method=method or ('POST' if body is not None else 'GET'),headers=headers),timeout=15)
            except HTTPError as error: response=error
            with response:
                raw=response.read(); return response.status,json.loads(raw) if raw else None,response.headers
        for _ in range(100):
            try:
                if request('/health')[0]==200: break
            except URLError: time.sleep(.1)
        else: raise AssertionError('Test API did not start')
        member=f'/auth/members/{ids["member"]}'
        for path in ['/auth/profile','/auth/member-directory',member+'/profile']:
            assert request(path)[0]==401
        assert request('/auth/member-directory',role='member')[0]==403
        assert request(member+'/profile',role='other')[0]==403
        assert request('/auth/overview')[0]==401
        assert request('/auth/overview',role='member')[0]==403
        assert request('/auth/overview',role='admin')[1]=={
            'total_accounts':3,'active_accounts':3,'pending_invitations':0,'contact_inquiries':0,'active_inquiries':0,'due_inquiries':0}
        # Exceed the invitation/inbox preview limits and exclude unavailable links.
        with Session(engine) as db:
            for index in range(54):
                db.add(Invitation(email=f'invite-{index}-{suffix}@example.test', token_hash=digest(secrets.token_urlsafe(32)),
                    created_by=ids['admin'], expires_at=now()+timedelta(hours=-1 if index==51 else 1),
                    used_at=now() if index==52 else None, revoked_at=now() if index==53 else None))
            for index in range(26):
                db.add(ContactInquiry(submission_id=secrets.token_hex(16), name='Test inquiry', email=emails['unknown'],
                    topic='General', message='Overview count check', created_at=now()))
            db.commit()
        assert request('/auth/overview',role='admin')[1]=={
            'total_accounts':3,'active_accounts':3,'pending_invitations':51,'contact_inquiries':26,'active_inquiries':26,'due_inquiries':0}
        row=request('/auth/profile',role='member')[1]
        assert row['phone']=='' and row['version']==0
        payload={'name':'  Updated Member  ','phone':'+1 555 0100','location':'Chicago, USA','bio':'Private profile','version':row['version']}
        assert request('/auth/profile',{**payload,'role':'admin'},'member','PATCH')[0]==422
        assert request('/auth/profile',{**payload,'email':emails['admin']},'member','PATCH')[0]==422
        assert request('/auth/profile',{**payload,'name':' '},'member','PATCH')[0]==422
        assert request('/auth/profile',payload,'member','PATCH',origin='https://evil.example')[0]==403
        status,saved,_=request('/auth/profile',payload,'member','PATCH')
        assert status==200 and saved['name']=='Updated Member' and saved['version']==1
        assert request('/auth/profile',payload,'member','PATCH')[0]==409
        assert request('/auth/profile',role='other')[1]['bio']==''
        assert request(member+'/profile',payload,'other','PATCH')[0]==403
        status,page,_=request('/auth/member-directory?q=updated&page_size=1',role='admin')
        assert status==200 and page['total']==1 and page['items'][0]['id']==ids['member']
        assert request('/auth/member-directory?page_size=1&page=2',role='admin')[1]['items'][0]['id']!=request('/auth/member-directory?page_size=1',role='admin')[1]['items'][0]['id']
        assert request('/auth/member-directory?q=%25',role='admin')[1]['total']==0
        assert request('/auth/member-directory?page_size=500',role='admin')[0]==422
        payload.update(name='Admin updated member',version=saved['version'])
        with ThreadPoolExecutor(max_workers=2) as pool:
            outcomes=list(pool.map(lambda _:request(member+'/profile',payload,'admin','PATCH')[0],range(2)))
        assert sorted(outcomes)==[200,409]
        row=request(member+'/profile',role='admin')[1]
        assert row['name']=='Admin updated member' and len(row['events'])==2
        assert request(f'/auth/members/{ids["admin"]}/access',{'active':False,'version':0},'admin','PATCH')[0]==403
        assert request(member+'/access',{'active':False,'version':row['version']},'member','PATCH')[0]==403
        assert request(member+'/access',{'active':'false','version':row['version']},'admin','PATCH')[0]==422
        status,row,_=request(member+'/access',{'active':False,'version':row['version']},'admin','PATCH')
        assert status==200 and not row['active']
        assert request('/auth/overview',role='admin')[1]['active_accounts']==2
        assert request('/auth/me',role='member')[0]==401
        assert request('/auth/login',{'email':emails['member'],'password':password})[0]==401
        assert request('/auth/member-directory?status=inactive',role='admin')[1]['total']==1
        status,row,_=request(member+'/access',{'active':True,'version':row['version']},'admin','PATCH')
        assert status==200 and row['active'] and row['bio']=='Private profile'
        assert request('/auth/me',role='member')[0]==401
        status,_,headers=request('/auth/login',{'email':emails['member'],'password':password})
        assert status==200; cookies['member']=headers['Set-Cookie'].split(';')[0]
        reset_path='/auth/password-reset/request'
        accepted=request(reset_path,{'email':emails['unknown']})
        assert accepted[0]==202
        accepted_known=request(reset_path,{'email':emails['member']})
        assert accepted_known[:2]==accepted[:2]
        def token_for(email):
            messages=mail('/messages?limit=200')['messages']
            item=next(item for item in messages if any(to['Address']==email for to in item['To']))
            return re.search(r'#token=([A-Za-z0-9_-]{43})',mail('/message/'+item['ID'])['Text']).group(1)
        token=token_for(emails['member'])
        with Session(engine) as db:
            assert db.get(PasswordReset,digest(token)) and not db.get(PasswordReset,token)
        endpoint='/auth/password-reset/confirm'
        assert request(endpoint,{'token':token,'password':'short'})[0]==422
        assert request(endpoint,{'token':token,'password':'12345678901234567890'})[0]==422
        with ThreadPoolExecutor(max_workers=2) as pool:
            outcomes=list(pool.map(lambda _:request(endpoint,{'token':token,'password':new_password})[0],range(2)))
        assert sorted(outcomes)==[200,400]
        assert request('/auth/me',role='member')[0]==401
        assert request('/auth/login',{'email':emails['member'],'password':password})[0]==401
        assert request('/auth/login',{'email':emails['member'],'password':new_password})[0]==200
        assert request(endpoint,{'token':token,'password':password})[0]==400
        request(reset_path,{'email':emails['other']}); stale=token_for(emails['other'])
        request(reset_path,{'email':emails['other']}); fresh=token_for(emails['other'])
        assert stale!=fresh and request(endpoint,{'token':stale,'password':new_password})[0]==400
        with Session(engine) as db:
            item=db.get(PasswordReset,digest(fresh));item.expires_at=now()-timedelta(seconds=1);db.commit()
        assert request(endpoint,{'token':fresh,'password':new_password})[0]==400
        request(reset_path,{'email':emails['other']})
        assert request(reset_path,{'email':emails['other']})[0]==429
        fresh=token_for(emails['other'])
        other=request(f'/auth/members/{ids["other"]}/profile',role='admin')[1]
        assert request(f'/auth/members/{ids["other"]}/access',{'active':False,'version':other['version']},'admin','PATCH')[0]==200
        assert request(endpoint,{'token':fresh,'password':new_password})[0]==400
        # A mail failure must preserve the old reset token and not reveal an account.
        with Session(engine) as db:
            old=PasswordReset(token_hash=digest('old-test-token'),user_id=ids['admin'],expires_at=now()+timedelta(minutes=10));db.add(old);db.commit()
            scope={'type':'http','client':('127.0.0.1',1234),'headers':[]}
            with patch('backend.app.accounts.smtplib.SMTP',side_effect=OSError), patch('backend.app.rate_limits.rate_limit_engine',engine):
                result=request_reset(EmailInput(email=emails['admin']),AppRequest(scope),db)
            assert result==accepted[1] and db.get(PasswordReset,digest('old-test-token'))
            actions=list(db.scalars(select(AccountEvent.action).where(AccountEvent.subject_id==ids['member'])))
            assert {'profile_updated','account_deactivated','account_reactivated','password_reset_completed'}<=set(actions)
            assert db.get(User,ids['member']).bio=='Private profile'
        print('PASS: private profiles, server authorization, validation, pagination/search, stale-write conflicts, reversible account access, session revocation, reset delivery/expiry/single-use/concurrency, mail rollback and account activity.')
    finally:
        if process: process.terminate();process.wait(timeout=10)
        log.close();engine.dispose()
        with base.begin() as connection: connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()
        messages=mail('/messages?limit=200')['messages']
        owned=[item['ID'] for item in messages if any(to['Address'].endswith(f'-{suffix}@example.test') for to in item['To'])]
        if owned: mail('/messages','DELETE',{'IDs':owned})

if __name__=='__main__': main()
