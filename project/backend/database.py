from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from db_config import dbConfig

user = dbConfig['user']
password = dbConfig['password']
host = dbConfig['host']
database = dbConfig['database']

SQLALCHEMY_DATABASE_URL = f'mysql+pymysql://{user}:{password}@{host}/{database}'

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
