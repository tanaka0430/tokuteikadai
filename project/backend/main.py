from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai_search import index_search, read_db
from pydantic import BaseModel
from db_config import create_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    #allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/answer/{text}/{order_num}")
async def get_answer(text:str,order_num:int):
    answer = index_search(text)
    return read_db(answer,order_num)


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


# シラバス検索
@app.post("/search")
async def search_courses(request: SearchRequest):
    campuses = request.campuses
    day_period_combinations = request.dayPeriodCombinations
    department = request.department
    semester = request.semester

    query = "SELECT * FROM aoyama_kougi WHERE 1=1"
    params = []

    # キャンパス条件
    if campuses:
        # 青山または相模原が選ばれていれば、部分一致で検索
        campus_condition = " AND ("
        campus_condition += " OR ".join([f"時限 LIKE %s" for _ in campuses])
        campus_condition += ")"
        query += campus_condition
        params.extend([f"%{campus}%" for campus in campuses])

    # 曜日と時限の条件
    if day_period_combinations:
        query += " AND ("
        query += " OR ".join([f"時限 LIKE %s" for _ in day_period_combinations])
        query += ")"
        params.extend([f"%{combo}%" for combo in day_period_combinations])

    # 学部条件
    if department and department != "指定なし":
        query += " AND 開講 = %s"
        params.append(department)

    # 学期条件
    if semester and semester != "指定なし":
        query += " AND 時限 LIKE %s"
        params.append(f"%{semester}%")

    # クエリ実行
    connection = create_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, tuple(params))
    results = cursor.fetchall()
    cursor.close()
    connection.close()

    return {"results": results}

# 学部リストの取得
@app.get("/departments")
async def get_departments():
    return {"departments": DEPARTMENTS}

# 学期リストの取得
@app.get("/semesters")
async def get_semesters():
    return {"semesters": SEMESTERS}