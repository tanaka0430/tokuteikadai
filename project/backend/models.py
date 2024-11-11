from sqlalchemy import Boolean, Column, Integer, String,Float
from database import Base

class User(Base):
    __tablename__="users"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String(255),unique=True,index=True)
    password = Column(String(255))
    is_active = Column(Boolean,default=True)
