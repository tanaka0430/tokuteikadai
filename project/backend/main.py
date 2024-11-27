from fastapi import Depends, FastAPI, HTTPException, Request, Response
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from openai_search import subset_search_batch
from crud import(
    get_user,get_user_by_name, get_user_by_name_by_password, 
    create_user,filter_course_ids, read_db,
    get_matching_kougi_ids,insert_user_kougi,
    delete_user_kougi,calendar_list,get_user_kougi,
    create_calendar,update_calendar,delete_calendar,get_calendar,
    update_user_def_calendar
)
from models import User
from schemas import User, UserCreate,SearchRequest,UserCalendarModel
from database import SessionLocal, engine, Base
import sys
import uvicorn

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    #allow_origins=["*"],
    allow_origins=["http://localhost:3000"],
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

@app.post("/users/register", response_model=User)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_name(db, name=user.name)
    if db_user:
        raise HTTPException(status_code=400, detail="Name already registered")
    
    return create_user(db=db, user=user)

@app.post("/users/login", response_model=User)
def read_user(
    response: Response,
    name: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = get_user_by_name_by_password(db, name=name, password=password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # セッションIDをクッキーに保存
    session_id = str(user.id)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        max_age=86400,  # クッキーの有効期限（1日）
        # secure=True,  # HTTPSでのみ送信（本番環境で有効化）
    )
    return user

#ユーザー情報（ページ遷移後に毎回実行）
@app.get("/users/info")
def get_current_user(
    request: Request, 
    db: Session = Depends(get_db)
):
    # クッキーからセッションIDを取得
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = session_id
    
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
def logout_user(response: Response):
    # セッションIDをクッキーから削除
    response.delete_cookie("session_id")
    return {"detail": "Logged out successfully"}

#チャット検索
@app.post("/answer/{text}")
async def get_answer(text: str,request: SearchRequest, calendar_id:int, db: Session = Depends(get_db)):
    id_list = filter_course_ids(db, request)
    answer = subset_search_batch(id_list,text)
    results = read_db(db, answer, calendar_id)
    print(results)
    return {"results": results}


# シラバス検索
@app.post("/search")
async def search_courses(request: SearchRequest, calendar_id:int, db: Session = Depends(get_db)):
    id_list = filter_course_ids(db, request)
    results = read_db(db,id_list, calendar_id)
    print(sys.getrefcount(results)) 
    print(results)
    return {"results": results}


#カレンダー作成・更新
@app.post("/calendar/c-u/{mode}")
def calendar_action_cu(mode: str, calendar_data: UserCalendarModel, db: Session = Depends(get_db)):
    try:
        if mode == "c":
            calendar = create_calendar(calendar_data,db)
        elif mode == "u":
            calendar = update_calendar(calendar_data,db)
        else:
            raise HTTPException(status_code=400, detail="Invalid mode")
        #printを消すとreturnが空になる。消さないこと。
        print(calendar)
        update_user_def_calendar(calendar.user_id,calendar.id, db)
        print(calendar)
        return {"calendar":calendar}
    
    except Exception as e:
        db.rollback()  # 例外発生時にロールバック
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")        

#カレンダー参照・削除
@app.post("/calendar/r-d/{mode}")
def calendar_action_rd(mode: str, user_id:int, calendar_id: int, db: Session = Depends(get_db)):
    try:
        if mode == "r":
            calendar = get_calendar(calendar_id, db)
        elif mode == "d":
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
    kougi_ids: list[int],
    calendar_id: int,
    db: Session = Depends(get_db)  
):
    success = []
    failures = []
    errors = []
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
    kougi_ids: list[int],
    calendar_id: int,
    db: Session = Depends(get_db)
):
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


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)