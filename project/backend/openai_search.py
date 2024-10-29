from openai import OpenAI
import os
from db_config import create_db_connection  # DB接続をインポート
import numpy as np
import faiss
from dotenv import load_dotenv
# ec２サーバーで作成した.envファイルを読み込む。.envはgitignoreに追加
load_dotenv()


# OpenAIクライアントのインスタンスを作成
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
index = faiss.read_index("faiss_index.bin")
connection = create_db_connection()


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

def read_db(id_list,order_num):
    connection = create_db_connection()  # 新たに接続を開く
    try:
        with connection.cursor() as cursor:

            # プレースホルダの数に合わせてクエリを作成
            query = "SELECT * FROM aoyama_kougi WHERE id IN (%s)" % ','.join(['%s'] * len(id_list))
            # クエリを実行
            cursor.execute(query, id_list)
            subjects = cursor.fetchall()

            return subjects[order_num]

    finally:
        if connection.open:
            connection.close()


if __name__ == "__main__":
    question = str(input())
    answer = read_db(index_search(question),2)#引数order_numは0～2、２の時は３番目
    print(answer)
    print(answer["科目"])