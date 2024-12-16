from fastapi import Depends, FastAPI, HTTPException, Request, Response
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from openai_search import subset_search_batch,generate_input
from crud import(
    get_user,get_user_by_name,
    create_user,filter_course_ids, read_db,
    get_matching_kougi_ids,insert_user_kougi,
    delete_user_kougi,calendar_list,get_user_kougi,
    create_calendar,update_calendar,delete_calendar,get_calendar,
    update_user_def_calendar,insert_chat,get_kougi_summary
)
from models import User
from schemas import User, UserCreate,SearchRequest,UserCalendarModel
from database import SessionLocal, engine, Base
import sys
import uvicorn
import bcrypt
import asyncio
import redis
import uuid

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    #allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    # パスワードをハッシュ化
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_pw.decode('utf-8')

def verify_password(stored_hash: str, password: str) -> bool:
    # 入力されたパスワードとハッシュ化されたパスワードを照合
    return bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))

# Redisクライアントの初期化
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)


# セッションをRedisに保存する関数
def store_session(session_id: str, user_id: int):
    redis_client.setex(session_id, 86400, str(user_id))  # セッション有効期限を1日（86400秒）に設定

# セッションをRedisから取得する関数
def get_session(session_id: str):
    if session_id is None:
        return None
    user_id = redis_client.get(session_id)
    return int(user_id) if user_id else None

def delete_session(session_id: str):
    redis_client.delete(session_id)

def get_userid(request: Request):
    session_id = request.cookies.get("session_id")
    if not get_session(session_id):
        return 0  
    else:
        return int(get_session(session_id))

@app.post("/users/register", response_model=User)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_name(db, name=user.name)
    if db_user:
        raise HTTPException(status_code=400, detail="Name already registered")
    
    hashed_password = hash_password(user.password)
    user.password = hashed_password
    
    return create_user(db=db, user=user)

@app.post("/users/login", response_model=User)
def read_user(
    response: Response,
    name: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = get_user_by_name(db, name=name)
    if not user or not verify_password(user.password, password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # セッションIDをクッキーに保存
    session_id = str(uuid.uuid4())
    
    # セッションIDとユーザーIDをRedisに保存
    store_session(session_id, user.id)
    
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        max_age=86400,  # クッキーの有効期限（1日）
        #samesite="None",
        secure=False,
    )
    return user

#ユーザー情報（ページ遷移後に毎回実行）
@app.post("/users/info")
def get_current_user(
    request: Request, 
    db: Session = Depends(get_db)
):
    print(request.headers)
    print(request.cookies)
    # クッキーからセッションIDを取得
    session_id = request.cookies.get("session_id")
    if not session_id:
        print(session_id)
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = get_session(session_id)
    
    # データベースからユーザー情報を取得
    user = get_user(db,user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    calendar = calendar_list(user_id,db)
    
    return {
        "user_info": {
            "id": user.id,
            "name": user.name,
            "def_calendar": user.def_calendar
        },
        "calendar_info": calendar
    }

#ログアウト
@app.post("/users/logout")
def logout_user(request: Request, response: Response):
    session_id = request.cookies.get("session_id")
    
    if session_id:
        delete_session(session_id)  # セッションをRedisから削除

    # セッションIDをクッキーから削除
    response.delete_cookie("session_id")
    return {"detail": "Logged out successfully"}

#チャット検索
@app.post("/answer/{text}")
async def get_answer(request: Request,text: str,searchrequest: SearchRequest, calendar_id:int, db: Session = Depends(get_db)):
    id_list = filter_course_ids(db, searchrequest)
    question = generate_input(text)
    answer = subset_search_batch(id_list,question)
    
    user_id = get_userid(request)
    print(user_id)
    
    owner_id = get_calendar(calendar_id,db).user_id
    print(owner_id)
    
    print(owner_id == user_id)
    if not owner_id == user_id:
        calendar_id = 0
    print(calendar_id)
    
    insert_chat(user_id,text,question,answer,db)
    kougi_summary = get_kougi_summary(answer,db)
    results = read_db(db, answer, calendar_id)
    print(results)
    return {"generated_input":question,"results": results,"kougi_summary":kougi_summary}


#講義要約文章確認
#おそらくフロントエンドでは使わない
@app.post("/kougi/summary")
def api_get_kougi_summary(kougi_ids: list[int], db: Session = Depends(get_db)):
    results = get_kougi_summary(kougi_ids,db)
    return {"results":results}


# シラバス検索
@app.post("/search")
async def search_courses(request: Request,searchrequest: SearchRequest, calendar_id:int, db: Session = Depends(get_db)):
    id_list = filter_course_ids(db, searchrequest)
    
    user_id = get_userid(request)
    
    owner_id = get_calendar(calendar_id,db).user_id
    if not owner_id == user_id:
        calendar_id = 0
    
    results = read_db(db,id_list,calendar_id)
    print(sys.getrefcount(results)) 
    print(results)
    return {"results": results}


#カレンダー作成・更新
@app.post("/calendar/c-u/{mode}")
def calendar_action_cu(request: Request, mode: str, calendar_data: UserCalendarModel, db: Session = Depends(get_db)):
    user_id = get_userid(request)
    try:
        if mode == "c":
            if not calendar_data.user_id == user_id:
                return {"detail":"not login"}
            calendar = create_calendar(calendar_data,db)
            
        elif mode == "u":
            owner_id = get_calendar(calendar_data.id,db).user_id
            if not owner_id == user_id:
                return {"detail":"not login"}
            calendar = update_calendar(calendar_data,db)
            
        else:
            raise HTTPException(status_code=400, detail="Invalid mode")
        #printを消すとreturnが空になる。消さないこと。
        print(calendar)
        update_user_def_calendar(user_id,calendar.id, db)
        print(calendar)
        return {"calendar":calendar}
    
    except Exception as e:
        db.rollback()  # 例外発生時にロールバック
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")        

#カレンダー参照・削除
@app.post("/calendar/r-d/{mode}")
def calendar_action_rd(request: Request, mode: str, user_id:int, calendar_id: int, db: Session = Depends(get_db)):
    user_id = get_userid(request)
    try:
        if mode == "r":
            calendar = get_calendar(calendar_id, db)
        elif mode == "d":
            owner_id = get_calendar(calendar_id,db).user_id
            if not owner_id == user_id:
                return {"detail":"not login"}
            calendar = delete_calendar(calendar_id, db)
            calendar_id = None
        else:
            raise HTTPException(status_code=400, detail="Invalid mode")
        #printを消すとreturnが空になる。消さないこと。
        print(calendar)
        update_user_def_calendar(user_id,calendar_id, db)
        print(calendar_id)
        return {"calendar":calendar}
        
    except Exception as e:
        db.rollback()  # 例外発生時にロールバック
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")    
    
    
#講義登録
@app.post("/kougi/insert")
def api_check_user_kougi(
    request: Request,
    kougi_ids: list[int],
    calendar_id: int,
    db: Session = Depends(get_db)  
):
    success = []
    failures = []
    errors = []
    user_id = get_userid(request)
    
    owner_id = get_calendar(calendar_id,db).user_id
    if not owner_id == user_id:
        return {"detail":"not login"}
            
    for kougi_id in kougi_ids:
        try:
            id_list = get_matching_kougi_ids(db, kougi_id, calendar_id)
            
            if id_list == []:
                insert_user_kougi(db, kougi_id, calendar_id) 
                success.append({"kougi_id": kougi_id})
            
            elif id_list:
                obstacles = read_db(db, id_list,calendar_id)
                print(failures)
                failures.append({"kougi_id": kougi_id, "obstacles": obstacles})
                print(failures)
        except Exception as e:
            errors.append({"kougi_id": kougi_id, "error": str(e)})
            
    return {"success": success, "failures": failures,"errors":errors}

    
#講義削除
@app.delete("/kougi/delete")
def api_delete_user_kougi(
    request: Request,
    kougi_ids: list[int],
    calendar_id: int,
    db: Session = Depends(get_db)
):
    user_id = get_userid(request)
    
    owner_id = get_calendar(calendar_id,db).user_id
    if not owner_id == user_id:
        return {"detail":"not login"}
            
    for kougi_id in kougi_ids:
        delete_user_kougi(db, kougi_id, calendar_id)
        
    return {"message": "Data deleted successfully"}

#登録済み講義取得
@app.post("/kougi/get/{calendar_id}")
def set_default_calendar(calendar_id: int, db: Session = Depends(get_db)):
    registered_user_kougi = get_user_kougi(calendar_id, db)
    
    id_list = [item.kougi_id for item in registered_user_kougi]
    
    results = read_db(db,id_list,calendar_id)
    
    return {"registered_user_kougi": registered_user_kougi,"results":results}


#ここより下はフロントエンドで実装してもよさそう
# 学部リストと学期リスト
DEPARTMENTS = [
    "指定なし","青山スタンダード科目", "文学部共通", "文学部外国語科目", "英米文学科", "フランス文学科",
    "比較芸術学科", "教育人間　外国語科目", "教育人間　教育学科", "教育人間　心理学科", "経済学部",
    "法学部", "経営学部", "教職課程科目", "国際政治経済学部", "総合文化政策学部", "日本文学科",
    "史学科", "理工学部共通", "物理科学", "数理サイエンス", "物理・数理", "電気電子工学科",
    "機械創造", "経営システム", "情報テクノロジ－", "社会情報学部", "地球社会共生学部", "コミュニティ人間科学部",
    "化学・生命"
]

SEMESTERS = [
    "指定なし","前期", "通年", "後期", "後期前半", "後期後半", "通年隔１", "前期前半", "前期後半",
    "通年隔２", "前期集中", "夏休集中", "集中", "春休集中", "後期集中", "前期隔２", "前期隔１",
    "後期隔２", "後期隔１", "通年集中"
]


# 学部リストの取得
@app.get("/departments")
async def get_departments():
    return {"departments": DEPARTMENTS}

# 学期リストの取得
@app.get("/semesters")
async def get_semesters():
    return {"semesters": SEMESTERS}


async def start_uvicorn():
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, reload=True)
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    try:
        asyncio.run(start_uvicorn())
    except KeyboardInterrupt:
        print("Server stopped gracefully.")