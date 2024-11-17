from sqlalchemy.orm import Session
from sqlalchemy import or_,text
from models import User,aoyama_kougi
from schemas import UserCreate

def get_users(db:Session):
    return db.query(User).all()

def get_user(db:Session,user_id:int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_name(db:Session,name:str):
    return db.query(User).filter(User.name == name).first()

def get_user_by_name_by_password(db:Session,name:str,password:str):
    return (db.query(User)
            .filter(User.name == name)
            .filter(User.password == password)
            .first()
    )

def create_user(db:Session,user:UserCreate):
    db_user = User(name=user.name,password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# `aoyama_kougi` テーブルに対する検索条件を適用し、IDのみをリストで返す関数
def filter_course_ids(db, request):
    # ベースクエリで `id` カラムのみを選択
    query = db.query(aoyama_kougi.id)

    # キャンパス条件
    if request.campuses:
        campus_conditions = [aoyama_kougi.時限.like(f"%{campus}%") for campus in request.campuses]
        query = query.filter(or_(*campus_conditions))

    # 曜日と時限の条件
    if request.dayPeriodCombinations:
        day_period_conditions = [aoyama_kougi.時限.like(f"%{combo}%") for combo in request.dayPeriodCombinations]
        query = query.filter(or_(*day_period_conditions))

    # 学部条件
    if request.departments and request.departments != ["指定なし"]:
        department_conditions = [aoyama_kougi.開講 == department for department in request.departments]
        query = query.filter(or_(*department_conditions))

    # 学期条件
    if request.semester and request.semester != "指定なし":
        query = query.filter(aoyama_kougi.時限.like(f"%{request.semester}%"))

    # 講義名条件
    if request.courseName:
        query = query.filter(aoyama_kougi.科目.like(f"%{request.courseName}%"))

    # 教員名条件
    if request.instructorName:
        query = query.filter(aoyama_kougi.教員.like(f"%{request.instructorName}%"))

    # 結果からIDのみをリストで返す
    result = query.all()
    return [r[0] for r in result]  # `result` はタプルのリストになるため、各タプルの最初の要素 (ID) を抽出


def read_db(db, id_list):
    # `id_list`が空の場合、すぐに空のリストを返す
    if not id_list:
        return []

    query = db.query(aoyama_kougi).filter(aoyama_kougi.id.in_(id_list))
    result = query.all()
    return result