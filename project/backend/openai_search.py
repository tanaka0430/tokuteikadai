from openai import OpenAI
import os
import numpy as np
import faiss
from dotenv import load_dotenv
from database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import select
from models import aoyama_kougi
from schemas import AoyamaKougiBase
from crud import read_db
from database import SessionLocal, engine, Base

# ec２サーバーで作成した.envファイルを読み込む。.envはgitignoreに追加
load_dotenv()
Base.metadata.create_all(bind=engine)
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

#絞り込みの確認用
def get_shakai_joho_id(session: Session):
    result = session.execute(
        select(aoyama_kougi.id).where(aoyama_kougi.開講 == "社会情報学部")
    ).scalars().all()

    return result

#絞り込み対応
def subset_search_batch(id_list, question):
    # id_list のすべての値を 1 減算
    id_list = [id - 1 for id in id_list]
    sel = faiss.IDSelectorBatch(id_list)
    params = faiss.SearchParametersIVF(sel=sel)
    D,I = index.search(
        get_embedding(question), k=9, params=params
    )
    # Iの各値に1を加算
    incremented_ids = [id + 1 for sublist in I for id in sublist]  # 一次元リストにフラット化しつつ加算
    return incremented_ids

#絞り込み未対応
def index_search(question):
    D,I = index.search(get_embedding(question), 3)#3件取得
    # Iの各値に1を加算
    incremented_ids = [id + 1 for sublist in I for id in sublist]  # 一次元リストにフラット化しつつ加算
    return incremented_ids





if __name__ == "__main__":
    db = next(get_db()) 
    question = str(input())
    
    result = read_db(db,index_search(question),0)[0]#引数order_numは0～2、２の時は３番目
    shajo_result = read_db(db,subset_search_batch(get_shakai_joho_id(db),question),0)[0]
    
    result = AoyamaKougiBase.model_validate(result)
    shajo_result = AoyamaKougiBase.model_validate(shajo_result)
    print(result) 
    print(shajo_result)

    print(result.科目)
    print(shajo_result.科目)
