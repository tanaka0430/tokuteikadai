from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from openai_search import index_search, read_db
from crud import get_user_by_name, get_user_by_name_by_password, create_user
from models import User
from schemas import User, UserCreate
from database import SessionLocal, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
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
async def get_answer(text: str, order_num: int):
    answer = index_search(text)
    return read_db(answer, order_num)
