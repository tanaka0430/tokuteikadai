from sqlalchemy.orm import Session

from models import User
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