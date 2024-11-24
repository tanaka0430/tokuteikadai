from sqlalchemy.orm import Session
from sqlalchemy import or_,text,and_
from models import User,aoyama_kougi,user_kougi,user_calendar
from schemas import UserCreate,UserCalendarModel
from fastapi import HTTPException

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
    if request.semesters and request.semesters != ["指定なし"]:
        semester_conditions = [aoyama_kougi.開講 == semester for semester in request.semesters]
        query = query.filter(or_(*semester_conditions))

    # 講義名条件
    if request.courseName:
        query = query.filter(aoyama_kougi.科目.like(f"%{request.courseName}%"))

    # 教員名条件
    if request.instructorName:
        query = query.filter(aoyama_kougi.教員.like(f"%{request.instructorName}%"))

    # 結果からIDのみをリストで返す
    result = query.all()
    return [r[0] for r in result]  # `result` はタプルのリストになるため、各タプルの最初の要素 (ID) を抽出


def read_db(db, id_list, calendar_id):
    if not id_list:
        return []

    # aoyama_kougi を取得
    query = db.query(aoyama_kougi).filter(aoyama_kougi.id.in_(id_list))
    
    result = query.all()

    # 各講義が登録されているかどうかを判定
    for kougi in result:
        # user_kougi から直接判定
        is_registered = db.query(user_kougi).filter(
            user_kougi.kougi_id == kougi.id,
            user_kougi.calendar_id == calendar_id
        ).first() is not None

        kougi.is_registered = 1 if is_registered else 0

    return {"results": result}



def get_matching_kougi_ids(db: Session, kougi_id: int, calendar_id: int):
    # 有効な時限のパターン
    valid_periods = {f"{day}{period}" for day in "月火水木金土" for period in "１２３４５６"}
        
    # aoyama_kougiテーブルから時限カラムを取得
    kougi = db.query(aoyama_kougi.時限).filter(aoyama_kougi.id == kougi_id).first()

    # kougiが見つからない、またはkougi.時限がない場合、エラーを投げる
    if not kougi or not kougi.時限:
        raise ValueError(f"kougi_id {kougi_id} に対応する kougi が見つからない、または 時限 が設定されていません。")

    # 時限カラムの文字列全体を解析し、（の前2文字を抽出して有効な時限のみ保持
    kougi_period = [
        kougi.時限[i-2:i]
        for i in range(len(kougi.時限))
        if kougi.時限[i] == "（" and kougi.時限[i-2:i] in valid_periods
    ]

    if not kougi_period:
        return []

    # user_kougiテーブルから条件に一致する行を取得し、kougi_idを抽出
    matching_kougi_ids = (
        db.query(user_kougi.kougi_id)
        .filter(
            and_(
                user_kougi.calendar_id == calendar_id,
                user_kougi.period.in_(kougi_period)
            )
        )
        .all()
    )

    # 結果をリスト形式で返す
    return [row.kougi_id for row in matching_kougi_ids]


def insert_user_kougi(db: Session, kougi_id: int, calendar_id: int):
    """
    user_kougi テーブルにデータを挿入する。
    
    Args:
        db (Session): データベースセッション。
        kougi_id (int): 挿入対象の講義ID。
        calendar_id (int): 挿入対象のカレンダーID。
    """
    # `aoyama_kougi` テーブルから該当する `時限` データを取得
    kougi = db.query(aoyama_kougi).filter(aoyama_kougi.id == kougi_id).one()  # 必ず1件だけ取得できると仮定

    # 時限データのリストを抽出
    periods = [ 
        kougi.時限[i-2:i]
        for i in range(len(kougi.時限))
        if kougi.時限[i] == "（"
    ]

    # `user_kougi` にデータを挿入
    for period in periods:
        new_entry = user_kougi(
            calendar_id=calendar_id,
            kougi_id=kougi_id,
            period=period
        )
        db.add(new_entry)

    # 変更をコミット
    db.commit()

def delete_user_kougi(db: Session, kougi_id: int, calendar_id: int):
    """
    user_kougi テーブルからデータを削除する。
    
    Args:
        db (Session): データベースセッション。
        kougi_id (int): 削除対象の講義ID。
        calendar_id (int): 削除対象のカレンダーID。
    """
    # 指定された `calendar_id` と `kougi_id` に一致する行を削除
    db.query(user_kougi).filter(
        user_kougi.kougi_id == kougi_id,
        user_kougi.calendar_id == calendar_id
    ).delete(synchronize_session=False)

    # 変更をコミット
    db.commit()
    
def manage_user_calendar(calendar_data: UserCalendarModel, mode: str, db: Session):
    try:
        # 新規作成モード
        if mode == "create":
            return create_calendar(calendar_data, db)

        # 更新モード
        elif mode == "update":
            return update_calendar(calendar_data, db)

        # 削除モード
        elif mode == "delete":
            return delete_calendar(calendar_data, db)

        # 無効なモードの場合
        else:
            raise HTTPException(status_code=400, detail="Invalid mode")

    except Exception as e:
        db.rollback()  # 例外発生時にロールバック
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")



def create_calendar(calendar_data: UserCalendarModel, db: Session):
    """カレンダーの新規作成処理"""
    # PydanticモデルからSQLAlchemyモデルを生成
    new_calendar = user_calendar(**calendar_data.dict())  # SQLAlchemyモデルに変換
    db.add(new_calendar)  # 新しいレコードを追加
    db.commit()  # 変更をコミット
    db.refresh(new_calendar)  # 挿入されたデータを更新
    return {"message": "Calendar created successfully", "data": new_calendar}


def update_calendar(calendar_data: UserCalendarModel, db: Session):
    """カレンダーの更新処理"""
    # 指定されたIDのカレンダーを検索
    calendar = db.query(user_calendar).filter(user_calendar.id == calendar_data.id).first()
    
    # カレンダーが見つからない場合
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")
    
    # Pydanticモデルから渡された更新データをカレンダーに反映
    for key, value in calendar_data.dict(exclude_unset=True).items():
        setattr(calendar, key, value)
    
    db.commit()  # 変更をコミット
    return {"message": "Calendar updated successfully"}


def delete_calendar(calendar_data: UserCalendarModel, db: Session):
    """カレンダーの削除処理"""
    # 指定されたIDのカレンダーを検索
    calendar = db.query(user_calendar).filter(user_calendar.id == calendar_data.id).first()

    # カレンダーが見つからない場合
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")
    
    db.delete(calendar)  # カレンダー削除
    db.commit()  # 変更をコミット
    return {"message": "Calendar deleted successfully"}

def get_calendar(calendar_id: int, db: Session):
    # `user_calendar`から指定されたIDのカレンダーを取得
    calendar = db.query(user_calendar).filter(user_calendar.id == calendar_id).first()

    # カレンダーが見つからない場合はエラー
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")
    

    # 取得したカレンダーのみを返す
    return {"calendar": calendar}

# ユーザーのdef_calendarを更新する関数
def update_user_def_calendar(calendar_id: int, db: Session):
    # カレンダーを取得
    calendar = get_calendar(calendar_id, db)

    # ユーザーを取得して、def_calendarを更新
    user = db.query(User).filter(User.id == calendar.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # def_calendarを更新
    user.def_calendar = calendar_id
    db.commit()
    db.refresh(user)  # ユーザーの最新データを反映

    return user

# user_idで関連するカレンダー情報とユーザー情報を取得する関数
def setup(user_id: int, db: Session):
    # user_calendarテーブルからuser_idに一致するidとcalendar_nameを取得
    user_calendar = db.query(user_calendar.id, user_calendar.calendar_name).filter(user_calendar.user_id == user_id).all()

    if not user_calendar:
        raise HTTPException(status_code=404, detail="User calendar not found")

    # usersテーブルからuser_idに一致するnameとdef_calendarを取得
    user = db.query(User.name, User.def_calendar).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 結果を辞書形式でまとめて返す
    return {
        "user_info": {
            "name": user.name,
            "def_calendar": user.def_calendar
        },
        "user_calendar": user_calendar
    }