from fastapi import Depends, FastAPI, HTTPException, Request, Form
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from openai_search import subset_search_batch
from crud import get_user_by_name, get_user_by_name_by_password, create_user,filter_course_ids, read_db,manage_user_calendar,get_calendar,update_user_def_calendar,get_matching_kougi_ids,insert_user_kougi,delete_user_kougi,setup
from models import User
from schemas import User, UserCreate,SearchRequest,UserCalendarModel
from database import SessionLocal, engine, Base
import os
from dotenv import load_dotenv
load_dotenv()  # .envファイルを読み込む
secret_key = os.getenv("SECRET_KEY")  # 環境変数からSECRET_KEYを取得


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

app.add_middleware(SessionMiddleware, secret_key=secret_key)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=User)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_name(db, name=user.name)
    if db_user:
        raise HTTPException(status_code=400, detail="Name already registered")
    
    return create_user(db=db, user=user)

@app.get("/users/", response_model=User)
def read_user(name: str = Form(...), password: str = Form(...), db: Session = Depends(get_db),request: Request= Depends()):
    db_user = get_user_by_name_by_password(db, name=name, password=password)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    # セッションにユーザーIDを保存
    request.session['user_id'] = db_user.id  # IDをセッションに格納
    return db_user

@app.post("/answer/{text}")
async def get_answer(text: str,request: SearchRequest, db: Session = Depends(get_db)):
    id_list = filter_course_ids(db, request)
    answer = subset_search_batch(id_list,text)
    return read_db(db, answer)


# シラバス検索
@app.post("/search")
async def search_courses(request: SearchRequest, db: Session = Depends(get_db)):
    id_list = filter_course_ids(db, request)
    return read_db(db,id_list)

#カレンダー一覧呼び出し
@app.get("/setup")
async def api_setup(user_id: int, db: Session):
    return setup(user_id, db)


#カレンダー作成・更新・削除
@app.post("/calendar/{mode}")
def calendar_action(mode: str, calendar_data: UserCalendarModel, db: Session = Depends(get_db)):
    update_user_def_calendar(calendar_data.id, db)
    return manage_user_calendar(calendar_data, mode, db)
    
    
#カレンダー読み取り
@app.post("/calendar/get/{calendar_id}")
def set_default_calendar(calendar_id: int, db: Session = Depends(get_db)):
    update_user_def_calendar(calendar_id, db)
    return get_calendar(calendar_id, db)
    
    
#講義のカレンダー登録状況チェック
@app.get("/kougi/check")
def api_check_user_kougi(
    kougi_id: int,
    calendar_id: int,
    db: Session = Depends(get_db)  
):
    id_list = get_matching_kougi_ids(db, kougi_id, calendar_id)
    if isinstance(id_list, list):
        return {"error": "エラー: 無効な応答または一致するエントリがありません。"}
    elif id_list:
        return read_db(db,id_list)
        
    return api_insert_user_kougi(kougi_ids=[kougi_id], calendar_id=calendar_id, db=db)

#講義登録
@app.post("/kougi/insert")
def api_insert_user_kougi(
    kougi_ids: list,
    calendar_id: int,
    db: Session = Depends(get_db)
):
    for kougi_id in kougi_ids:
        insert_user_kougi(db, kougi_id, calendar_id)
    return {"message": "Data inserted successfully"}
    
#講義削除
@app.delete("/kougi/delete")
def api_delete_user_kougi(
    kougi_ids: list,
    calendar_id: int,
    db: Session = Depends(get_db)
):
    for kougi_id in kougi_ids:
        delete_user_kougi(db, kougi_id, calendar_id)
    return {"message": "Data deleted successfully"}



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