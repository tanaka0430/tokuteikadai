from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from openai_search import subset_search_batch
from crud import get_user_by_name, get_user_by_name_by_password, create_user,filter_course_ids, read_db
from models import User
from schemas import User, UserCreate,SearchRequest
from database import SessionLocal, engine, Base



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

@app.post("/users/", response_model=User)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_name(db, name=user.name)
    if db_user:
        raise HTTPException(status_code=400, detail="Name already registered")
    
    return create_user(db=db, user=user)

@app.get("/users/", response_model=User)
def read_user(name: str, password: str, db: Session = Depends(get_db)):
    db_user = get_user_by_name_by_password(db, name=name, password=password)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/answer/{text}")
async def get_answer(text: str,request: SearchRequest, db: Session = Depends(get_db)):
    ids = filter_course_ids(db, request)
    answer = subset_search_batch(ids,text)
    results = read_db(db, answer)
    return {"results": results}

# シラバス検索
@app.post("/search")
async def search_courses(request: SearchRequest, db: Session = Depends(get_db)):
    ids = filter_course_ids(db, request)
    results = read_db(db,ids)
    return {"results": results}

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