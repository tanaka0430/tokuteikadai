from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from fastapi.middleware.cors import CORSMiddleware
from openai_search import index_search, read_db
from crud import get_user_by_name, get_user_by_name_by_password, create_user
from models import User,aoyama_kougi
from schemas import User, UserCreate
from database import SessionLocal, engine, Base
from db_config import create_db_connection  # DB接続をインポート
from pydantic import BaseModel


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

@app.post("/answer/{text}/{order_num}")
async def get_answer(text: str, order_num: int, db: Session = Depends(get_db)):
    answer = index_search(text)
    return read_db(db, answer, order_num)


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

# リクエストボディのモデル
class SearchRequest(BaseModel):
    campuses: list[str] = []
    dayPeriodCombinations: list[str] = []
    department: str = "指定なし"
    semester: str = "指定なし"
    courseName: str = None  # デフォルト値Noneで講義名を追加
    instructorName: str = None  # デフォルト値Noneで教員名を追加

# シラバス検索
@app.post("/search")
async def search_courses(
    request: SearchRequest, 
    db: Session = Depends(get_db)
):
    campuses = request.campuses
    day_period_combinations = request.dayPeriodCombinations
    department = request.department
    semester = request.semester
    course_name = request.courseName
    instructor_name = request.instructorName

    # ベースクエリ
    query = db.query(aoyama_kougi)

    # キャンパス条件
    if campuses:
        campus_conditions = [aoyama_kougi.時限.like(f"%{campus}%") for campus in campuses]
        query = query.filter(or_(*campus_conditions))

    # 曜日と時限の条件
    if day_period_combinations:
        day_period_conditions = [aoyama_kougi.時限.like(f"%{combo}%") for combo in day_period_combinations]
        query = query.filter(or_(*day_period_conditions))

    # 学部条件
    if department and department != "指定なし":
        query = query.filter(aoyama_kougi.開講 == department)

    # 学期条件
    if semester and semester != "指定なし":
        query = query.filter(aoyama_kougi.時限.like(f"%{semester}%"))

    # 講義名条件
    if course_name:
        query = query.filter(aoyama_kougi.科目.like(f"%{course_name}%"))

    # 教員名条件
    if instructor_name:
        query = query.filter(aoyama_kougi.教員.like(f"%{instructor_name}%"))

    # クエリ実行
    results = query.all()

    return {"results": results}

# 学部リストの取得
@app.get("/departments")
async def get_departments():
    return {"departments": DEPARTMENTS}

# 学期リストの取得
@app.get("/semesters")
async def get_semesters():
    return {"semesters": SEMESTERS}