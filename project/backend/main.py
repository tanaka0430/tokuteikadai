from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai_search import index_search, read_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/answer/{text}/{order_num}")
async def get_answer(text:str,order_num:int):
    answer = index_search(text)
    return read_db(answer,order_num)
