"""Staff capability matrix, reauthentication and lockout checks in an owned schema."""
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

from .app.access import CAPABILITIES
from .app.auth import digest, now, password_hash
from .app.database import DATABASE_URL
from .app.models import ContactInquiry, Introduction, LoginSession, PasswordReset, TeamEvent, User


def main():
    schema = "team_check_" + secrets.token_hex(6)
    base = create_engine(DATABASE_URL)
    with base.begin() as connection: connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    url = make_url(DATABASE_URL).update_query_dict({"options": f"-csearch_path={schema}"})
    engine = create_engine(url)
    env = dict(os.environ, DATABASE_URL=url.render_as_string(hide_password=False), WISCONNECT_LOCAL_AUTH="1")
    process = None; log = tempfile.TemporaryFile(); ids = {}; cookies = {}
    password = secrets.token_urlsafe(24); hashed = password_hash(password)
    try:
        subprocess.run([sys.executable, "-m", "alembic", "-c", "backend/alembic.ini", "upgrade", "0010_application_invitations"], env=env, check=True)
        with engine.begin() as connection:
            connection.execute(text("INSERT INTO users (email,name,password_hash,role,active) VALUES ('admin@example.test','Administrator',:password,'admin',true)"), {"password": hashed})
        subprocess.run([sys.executable, "-m", "alembic", "-c", "backend/alembic.ini", "upgrade", "head"], env=env, check=True)
        grants = {"member": [], **{key: [key] for key in CAPABILITIES}, "both": ["applications.review", "invitations.manage"]}
        grants["businesses.publish"] = ["businesses.edit", "businesses.publish"]
        with Session(engine) as db:
            admin = db.scalar(select(User).where(User.email == "admin@example.test"))
            assert admin.role == "admin" and admin.capabilities == [] and admin.password_hash == hashed
            people = {"admin": admin}
            for label, values in grants.items():
                person = User(name=label, email=label+"@example.test", password_hash=hashed, role="member", capabilities=values)
                db.add(person); db.flush(); people[label] = person
            for label, person in people.items():
                ids[label] = person.id
                token = secrets.token_urlsafe(32); cookies[label] = "wisconnect_local_session=" + token
                db.add(LoginSession(token_hash=digest(token), user_id=person.id, expires_at=now()+timedelta(hours=1)))
            db.add(PasswordReset(token_hash=digest("owned reset"), user_id=ids["member"], expires_at=now()+timedelta(minutes=10)))
            introduction = Introduction(submission_id=str(uuid4()), name="Sample", email="member@example.test", location="Sample", expertise="Sample", contribution="Sample", created_at=now(), updated_at=now())
            inquiry = ContactInquiry(submission_id=str(uuid4()), name="Sample", email="member@example.test", topic="Sample", message="Sample", created_at=now())
            db.add_all([introduction,inquiry]); db.flush(); application_id, inquiry_id = introduction.id, inquiry.id; db.commit()
        with socket.socket() as sock: sock.bind(("127.0.0.1",0)); port = sock.getsockname()[1]
        process = subprocess.Popen([sys.executable,"-m","uvicorn","backend.app.main:app","--host","127.0.0.1","--port",str(port),"--no-access-log","--no-proxy-headers"],env=env,stdout=log,stderr=log)

        def request(path, role=None, body=None, method=None, origin="http://localhost:3000"):
            headers = {"Origin": origin, "X-WisConnect-Request": "1", "Content-Type": "application/json"}
            if role: headers["Cookie"] = cookies[role]
            try: response = urlopen(Request(f"http://127.0.0.1:{port}"+path, headers=headers, data=json.dumps(body).encode() if body is not None else None, method=method or ("POST" if body is not None else "GET")),timeout=15)
            except HTTPError as error: response = error
            with response:
                raw = response.read().decode("utf-8-sig")
                return response.status, json.loads(raw) if raw and response.headers.get("Content-Type","").startswith("application/json") else raw, response.headers

        for _ in range(100):
            try:
                if request("/health")[0] == 200: break
            except URLError: time.sleep(.1)
        else: raise AssertionError("API did not start")
        routes = {"businesses.edit": ["/businesses", "/businesses/options", "/businesses/owners", "/businesses/1", "/businesses/1/activity"],
                  "applications.review": ["/applications", "/applications/reviewers", f"/applications/{application_id}", f"/applications/{application_id}/activity"],
                  "inquiries.manage": ["/contact-inquiries", "/contact-inquiries/assignees", f"/contact-inquiries/{inquiry_id}", f"/contact-inquiries/{inquiry_id}/activity"],
                  "invitations.manage": ["/invitations"], "reports.view": ["/reports", "/reports/export"]}
        for role, permissions in grants.items():
            me = request("/auth/me",role)[1]
            assert me["capabilities"] == sorted(permissions)
            for capability, paths in routes.items():
                for path in paths:
                    assert request("/auth"+path,role)[0] == (200 if capability in permissions else 403), (role,path)
            for path in ("/team",f"/team/{ids['admin']}","/member-directory","/overview","/members","/newsletter-subscribers"):
                assert request("/auth"+path,role)[0] == 403, (role,path)
        assert request("/auth/team")[0] == 401
        assert request("/auth/me","member",{"name":"Override","capabilities":["reports.view"]},"PATCH")[0] == 422
        assert request("/auth/team?access=staff","admin")[1]["total"] == len(grants)-1
        assert request("/auth/team?q=member%40example.test","admin")[1]["total"] == 1
        assert request("/auth/team?access=invalid","admin")[0] == 422
        for role in grants:
            response = request(f"/auth/team/{ids['admin']}", role, {"role":"admin","active":True,"capabilities":[],"version":0,"request_id":str(uuid4()),"password":password}, "PATCH")
            assert response[0] == 403
        # Every privileged write has a server gate independent of navigation.
        assert request('/auth/businesses/1/publication','businesses.edit',{'action':'archive','version':0,'request_id':str(uuid4())})[0] == 403
        assert request('/auth/businesses/1/publication','businesses.publish',{'action':'archive','version':0,'request_id':str(uuid4())})[0] == 200
        for role, code in [('applications.review',403),('invitations.manage',403),('both',409)]:
            assert request(f'/auth/applications/{application_id}/invite',role,{'version':0,'request_id':str(uuid4())})[0] == code
        assert request('/auth/invitations','invitations.manage',{'email':'member@example.test'})[0] == 409
        reviewers = request('/auth/applications/reviewers','applications.review')[1]
        assert ids['applications.review'] in {r['id'] for r in reviewers} and ids['reports.view'] not in {r['id'] for r in reviewers}
        assert request(f'/auth/applications/{application_id}','applications.review',{'version':0,'request_id':str(uuid4()),'status':'reviewing','reviewer_id':ids['applications.review'],'note':'Scoped review'},'PATCH')[0] == 200
        assert request(f'/auth/contact-inquiries/{inquiry_id}','inquiries.manage',{'version':0,'request_id':str(uuid4()),'status':'in_progress','assignee_id':ids['inquiries.manage'],'follow_up_on':None,'note':'Scoped follow-up'},'PATCH')[0] == 200
        for path, method in [(f"/auth/members/{ids['reports.view']}/access","PATCH"),(f"/auth/members/{ids['reports.view']}","DELETE")]:
            assert request(path,"admin",{"active":False,"version":0} if method=="PATCH" else None,method)[0] == 403
        target_path=f"/auth/team/{ids['member']}"
        payload={"role":"member","active":True,"capabilities":["reports.view"],"version":0,"request_id":str(uuid4()),"password":password}
        assert request(target_path,"admin",payload,"PATCH",origin="https://evil.test")[0] == 403
        for invalid in ({"capabilities":["team.manage"]},{"capabilities":["businesses.publish"]},{"capabilities":["reports.view","reports.view"]},{"role":"admin"},{"active":1},{"version":True}):
            response=request(target_path,"admin",{**payload,**invalid},"PATCH")
            assert response[0] == 422 and password not in json.dumps(response[1])
        assert request(f"/auth/team/{ids['admin']}","admin",{**payload,"capabilities":[],"active":False},"PATCH")[0] == 409
        assert request(target_path,"admin",{**payload,"password":"wrong"},"PATCH")[0] == 403
        assert request(target_path,"admin",{**payload,"version":999},"PATCH")[0] == 409
        saved=request(target_path,"admin",payload,"PATCH")
        assert saved[0] == 200 and saved[1]["version"] == 1 and saved[1]["capabilities"] == ['reports.view']
        assert request(target_path,"admin",payload,"PATCH")[0] == 200
        assert request(target_path,"admin",payload,"PATCH")[0] == 429
        assert request('/auth/me','member')[0] == 401
        with Session(engine) as db:
            assert db.scalar(select(func.count()).select_from(TeamEvent)) == 1
            assert not db.scalar(select(PasswordReset).where(PasswordReset.user_id==ids['member']))
            db.execute(text('DELETE FROM rate_limit_buckets')); db.commit()
        status, me, headers=request('/auth/login',body={'email':'member@example.test','password':password})
        assert status==200 and me['capabilities']==['reports.view'];cookies['member']=headers['Set-Cookie'].split(';')[0]
        assert request('/auth/reports','member')[0]==200 and request('/auth/businesses','member')[0]==403
        assert request(target_path,'member',{**payload,'role':'admin','capabilities':[],'version':1},'PATCH')[0]==403
        with ThreadPoolExecutor(max_workers=2) as pool:
            responses=list(pool.map(lambda _:request(target_path,'admin',{**payload,'version':1,'active':False,'request_id':'11111111-1111-4111-8111-111111111111'},'PATCH')[0],range(2)))
        assert responses==[200,200]
        assert request('/auth/me','member')[0]==401
        with Session(engine) as db:
            assert db.scalar(select(func.count()).select_from(TeamEvent))==2
            row=db.get(User,ids['member']);row.active=True;row.role='admin';row.capabilities=[]
            token=secrets.token_urlsafe(32);cookies['member']='wisconnect_local_session='+token
            db.add(LoginSession(token_hash=digest(token),user_id=row.id,expires_at=now()+timedelta(hours=1)));db.commit()
        # Simultaneous administrators trying to remove one another: exactly one succeeds.
        def demote(pair):
            actor,target,version=pair
            return request(f'/auth/team/{ids[target]}',actor,{**payload,'capabilities':[],'version':version,'request_id':str(uuid4())},'PATCH')[0]
        with ThreadPoolExecutor(max_workers=2) as pool:
            outcomes=list(pool.map(demote,[('admin','member',2),('member','admin',0)]))
        assert outcomes.count(200)==1 and any(value in {401,403} for value in outcomes),outcomes
        with Session(engine) as db:
            assert db.scalar(select(func.count()).select_from(User).where(User.active.is_(True),User.role=='admin'))==1
            assert db.scalar(select(func.count()).select_from(TeamEvent))==3
        assert password not in json.dumps(saved[1]) and 'fingerprint' not in json.dumps(saved[1])
        print('PASS: migration preservation, six-capability read/write matrix, independent publishing/invitation grants, staff assignments, admin-only account/team gates, reauthentication/rate limits, no self escalation, version conflicts, retries/concurrency, last-administrator protection, session/reset revocation and private audit history. No external mail or real changes.')
    except Exception:
        log.seek(0);print(log.read().decode(errors='replace')[-4000:]);raise
    finally:
        if process:process.terminate();process.wait(timeout=10)
        log.close();engine.dispose()
        with base.begin() as connection:connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()


if __name__=='__main__':main()
