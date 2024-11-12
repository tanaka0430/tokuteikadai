from sqlalchemy import Boolean, Column, Integer, String,Float,Text
from database import Base

class User(Base):
    __tablename__="users"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String(255),unique=True,index=True)
    password = Column(String(255))
    is_active = Column(Boolean,default=True)

class aoyama_kougi(Base):
    __tablename__ = "aoyama_kougi"  # テーブル名とクラス名を統一

    id = Column(Integer, primary_key=True, autoincrement=True)
    時限 = Column(String(255))
    科目 = Column(String(255))
    教員 = Column(String(255))
    単位 = Column(String(255))
    開講 = Column(String(255))
    学年 = Column(String(255))
    メッセージ = Column(Text)
    url = Column(Text)