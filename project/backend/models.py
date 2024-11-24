from sqlalchemy import Boolean, Column, Integer, String,Float,Text, ForeignKey, PrimaryKeyConstraint,JSON
from database import Base

class User(Base):
    __tablename__="users"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String(255),unique=True,index=True)
    password = Column(String(255))
    def_calendar = Column(Integer, ForeignKey('user_calendar.id'))
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

class user_calendar(Base):
    __tablename__ = "user_calendar"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    calendar_name = Column(String(255))
    campus = Column(JSON)
    department = Column(JSON)
    semester = Column(JSON)
    sat_flag = Column(Boolean,default=True)
    sixth_period_flag = Column(Boolean,default=True)
    

  
class user_kougi(Base):
    __tablename__ = "user_kougi"
    
    calendar_id = Column(Integer, ForeignKey('user_calendar.id', ondelete='CASCADE'))
    kougi_id = Column(Integer, ForeignKey('aoyama_kougi.id', ondelete='CASCADE'))
    period = Column(String(50))
    
    __table_args__ = (
        PrimaryKeyConstraint('calendar_id','kougi_id','period'),      
    )