from openai import OpenAI
import os
import numpy as np
import faiss
from dotenv import load_dotenv
from database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import text


# ec２サーバーで作成した.envファイルを読み込む。.envはgitignoreに追加
load_dotenv()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# OpenAIクライアントのインスタンスを作成
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
index = faiss.read_index("faiss_index.bin")



def get_embedding(text):
    response = client.embeddings.create(
        model="text-embedding-ada-002",  # モデル名を適切なものに変更
        input=text
    )
    # 埋め込みベクトルを取得
    return  np.array([response.data[0].embedding]).astype("float32")

def index_search(question):
    D,I = index.search(get_embedding(question), 3)#3件取得
    # Iの各値に1を加算
    incremented_ids = [id + 1 for sublist in I for id in sublist]  # 一次元リストにフラット化しつつ加算
    return incremented_ids

def read_db(db:Session,id_list,order_num):
    # プレースホルダを一つにして、SQLAlchemyにリスト全体を渡す
    query = text("SELECT * FROM aoyama_kougi WHERE id IN :id_list")
    
    # パラメータの辞書
    params = {"id_list": tuple(id_list)}  # リストをタプルに変換して渡す
    
    # クエリを実行
    result = db.execute(query, params).mappings().all()

    return result[order_num]



if __name__ == "__main__":
    db = next(get_db()) 
    question = str(input())
    answer = read_db(db,index_search(question),2)#引数order_numは0～2、２の時は３番目
    print(answer)
    print(answer["科目"])