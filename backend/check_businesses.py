"""Business publishing checks in a disposable schema; no real listings changed."""
import json
import os
from pathlib import Path
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
from .app.businesses import SEED
from .app.database import DATABASE_URL
from .app.models import Business, BusinessEvent, LoginSession, User


def main():
    schema='businesses_check_'+secrets.token_hex(6)
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
        public=request('/businesses')
        assert public[0]==200 and public[2]['Cache-Control']=='no-store'
        catalog=json.loads((Path(__file__).parents[1]/'app'/'business-catalog.json').read_text())
        expected=catalog
        assert sorted(public[1]['items'],key=lambda row:row['id'])==sorted(expected,key=lambda row:row['id']), 'Imported listing contents must be identical'
        for path in ['/auth/businesses','/auth/businesses/1','/auth/businesses/1/activity','/auth/businesses/options','/auth/businesses/owners']:
            assert request(path)[0]==401 and request(path,role='member')[0]==403 and request(path,role='inactive')[0]==401
        data={key:value for key,value in SEED[0].items() if key!='id'}
        data={**data,'name':'A test enterprise','person':'Public person','profile':None,'website':'https://example.test/enterprise','public_email':'public@example.test'}
        body={'request_id':str(uuid4()),'slug':'test-enterprise','public':data,'owner_id':ids['member'],'internal_email':'private@example.test','internal_phone':'private phone','internal_notes':'Private note'}
        assert request('/auth/businesses',body,'admin',origin='https://bad.example')[0]==403
        assert request('/auth/businesses',body,'member')[0]==403
        for change in [{'slug':'../unsafe'},{'owner_id':ids['inactive']},{'status':'published'},
                       {'public':{**data,'website':'javascript:alert(1)'}},{'public':{**data,'profile':'Unapproved person'}},
                       {'public':{**data,'visual':{**data['visual'],'image':'../../private.env'}}},
                       {'public':{**data,'description':'x'*2001}}]:
            assert request('/auth/businesses',{**body,**change},'admin')[0]==422,change
        with ThreadPoolExecutor(max_workers=2) as pool: created=list(pool.map(lambda _:request('/auth/businesses',body,'admin'),range(2)))
        assert all(item[0]==201 for item in created) and created[0][1]['id']==created[1][1]['id']
        saved=created[0][1];path=f'/auth/businesses/{saved["id"]}'
        assert saved['status']=='draft' and saved['owner_id']==ids['member'] and saved['published'] is None
        assert len(request('/businesses')[1]['items'])==12
        assert request('/auth/businesses',{**body,'request_id':str(uuid4())},'admin')[0]==409
        assert request('/auth/businesses',{**body,'internal_notes':'Changed retry'},'admin')[0]==409
        def action(name,version,request_id=None):
            return request(path+'/publication',{'request_id':request_id or str(uuid4()),'version':version,'action':name},'admin')
        published=action('publish',0);assert published[0]==200 and published[1]['status']=='published'
        listing=next(item for item in request('/businesses')[1]['items'] if item['id']=='test-enterprise')
        assert listing=={'id':'test-enterprise',**data} and 'private' not in json.dumps(listing)
        edit={key:value for key,value in body.items() if key not in {'slug','request_id'}}
        edit={**edit,'request_id':str(uuid4()),'version':1,'public':{**data,'description':'Unpublished replacement'}}
        with ThreadPoolExecutor(max_workers=2) as pool: results=list(pool.map(lambda _:request(path,edit,'admin',method='PATCH'),range(2)))
        assert all(item[0]==200 and item[1]['version']==2 for item in results)
        assert next(item for item in request('/businesses')[1]['items'] if item['id']=='test-enterprise')['description']==data['description']
        assert request(path,{**edit,'request_id':str(uuid4())},'other',method='PATCH')[0]==409
        assert action('publish',1)[0]==409
        published=action('publish',2);assert published[0]==200
        assert next(item for item in request('/businesses')[1]['items'] if item['id']=='test-enterprise')['description']=='Unpublished replacement'
        archived=action('archive',3);assert archived[0]==200 and archived[1]['status']=='archived'
        assert len(request('/businesses')[1]['items'])==12
        assert action('publish',4)[0]==409
        restored=action('restore',4);assert restored[0]==200 and restored[1]['status']=='draft'
        assert len(request('/businesses')[1]['items'])==12
        retry_id=str(uuid4());assert action('publish',5,retry_id)[0]==200
        assert action('publish',5,retry_id)[1]['version']==6
        assert request('/auth/businesses?q=test-enterprise&status=published',role='admin')[1]['total']==1
        assert request('/auth/businesses?q=%25',role='admin')[1]['total']==0
        assert request('/auth/businesses/owners?q=member',role='admin')[1]==[{'id':ids['member'],'name':'member','email':'member@example.test'}]
        with Session(engine) as db:
            assert db.scalar(select(func.count()).select_from(BusinessEvent).where(BusinessEvent.request_id==edit['request_id']))==1
            assert db.scalar(select(func.count()).select_from(User))==4
            for n in range(105):
                db.add(Business(slug=f'page-{n}',draft=data,published=data,status='published',created_at=now(),updated_at=now()))
            for n in range(26):
                db.add(BusinessEvent(business_id=saved['id'],actor_name='Test',action='saved',created_at=now()))
            db.commit()
        first=request('/businesses')[1];second=request('/businesses?after='+str(first['next_cursor']))[1]
        assert len(first['items'])==100 and len(second['items'])==18 and second['next_cursor'] is None
        assert not {item['id'] for item in first['items']}&{item['id'] for item in second['items']}
        first=request('/auth/businesses',role='admin')[1];second=request('/auth/businesses?page=2',role='admin')[1]
        assert first['total']==118 and len(first['items'])==25 and len(second['items'])==25
        events=request(path+'/activity',role='admin')[1];older=request(path+'/activity?before='+str(events['next_cursor']),role='admin')[1]
        assert len(events['items'])==25 and older['items']
        assert not {row['id'] for row in events['items']}&{row['id'] for row in older['items']}
        print('PASS: exact 12-listing import, admin-only writes and private fields, validation, active owner links, idempotent/concurrent creation and editing, stale conflicts, draft/published isolation, archive/restore, publish retries, public/admin/history pagination and search.')
    except BaseException:
        log.seek(0);print(log.read().decode()[-3000:]);raise
    finally:
        if process:process.terminate();process.wait(timeout=10)
        log.close();engine.dispose()
        with base.begin() as connection:connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()

if __name__=='__main__':main()
