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


def generate_input(text):
    # メッセージのリストを作成
    messages = [
        {"role": "system", "content": "あなたは教育ガイダンスの専門家です。"},
        {
            "role": "user",
            "content": f"""
                以下の入力に基づいて、userが受講するのに最適な講義の内容を出力してください。
                出力は出力フォーマットを厳格に守ってください。

                入力内容に含まれる単語・概念がニッチすぎる場合は、その単語・概念が含まれる講義となるように抽象化してください。
                どの学術的な分野に対応するかを出力に含めるようにしてください。

                出力フォーマットの項目「進行方法」もしくは「評価方法」のそれぞれについては、積極的には補完せず、入力に該当する記述がなければ空欄のままにしてください。
                ただし入力から確実に断定できる箇所がある場合に限り、対応する項目に対して簡潔にその点のみを出力してください。

                日本語で出力してください。
                出力のトークン数は、全体で700を目安にしてください。
                出力の比率として、400トークン以上が「内容」、「目的」、「対象学生層」となるようにしてください。

                #入力
                {text}

                #出力フォーマット
                講義名:
                内容:
                目的:
                対象学生層:
                進行方法:
                評価方法:
            """
        }
    ]

    # チャットコンプリーションの生成
    completion = client.chat.completions.create(
        model="gpt-4o-mini",  # 使用するモデルを指定
        messages=messages,
        temperature=0,
        max_tokens=1000  # 適切なトークン数に変更
    )

    # 生成されたテキストを返す
    return completion.choices[0].message.content.strip()  # オブジェクトのプロパティとしてアクセス

def get_embedding(text):
    response = client.embeddings.create(
        model="text-embedding-3-small",  # モデル名を適切なものに変更
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
    print(question)
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
    print(question)
    D,I = index.search(get_embedding(question), 3)#3件取得
    # Iの各値に1を加算
    incremented_ids = [id + 1 for sublist in I for id in sublist]  # 一次元リストにフラット化しつつ加算
    return incremented_ids





if __name__ == "__main__":
    db = next(get_db()) 
    question = str(input())
    question = generate_input(question)
    
    result = read_db(db,index_search(question),0)[0]#引数order_numは0～2、２の時は３番目
    shajo_result = read_db(db,subset_search_batch(get_shakai_joho_id(db),question),0)[0]
    
    result = AoyamaKougiBase.model_validate(result)
    shajo_result = AoyamaKougiBase.model_validate(shajo_result)
    print(result) 
    print(shajo_result)

    print(result.科目)
    print(shajo_result.科目)
