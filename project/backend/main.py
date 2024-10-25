from fastapi import FastAPI
from openai_search import read_db,index_search
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/answer/{text}/{order_num}")
async def get_answer(text:str,order_num:int):
    answer = index_search(text)
    return read_db(answer,order_num)