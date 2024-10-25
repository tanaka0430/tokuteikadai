from openai import OpenAI
import json
import sys
import os
from db_config import create_db_connection  # DB接続をインポート
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
import ast
from dotenv import load_dotenv
# ec２サーバーで作成した.envファイルを読み込む。.envはgitignoreに追加
load_dotenv()


# OpenAIクライアントのインスタンスを作成
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

connection = create_db_connection()
question = str(input())

def get_embedding(text):
    response = client.embeddings.create(
        model="text-embedding-ada-002",  # モデル名を適切なものに変更
        input=text
    )
    # 埋め込みベクトルを取得
    return response.data[0].embedding



try:
    with connection.cursor() as cursor:
        # ssi_embテーブルのaoyama_kougi_idとembカラムを全件取得するクエリ
        query = """
        SELECT aoyama_kougi_id, openai_emb
        FROM aoyama_openai_emb
        """
        cursor.execute(query)
        result = cursor.fetchall()  # 全件取得

        # DataFrameに変換
        df = pd.DataFrame(result, columns=['aoyama_kougi_id', 'openai_emb'])
        

        # 'emb' をリストに変換し、numpy配列に変換
        def decode_and_convert(x):
            if isinstance(x, bytes):
                x = x.decode('utf-8')  # bytesをstrにデコード
            return np.array(ast.literal_eval(x)).reshape(1, -1)

        df['openai_emb'] = df['openai_emb'].apply(decode_and_convert)
        
        
        # コサイン類似度を計算
        df['similarity'] = df['openai_emb'].apply(
            lambda openai_emb: cosine_similarity(
                np.array(get_embedding(question)).reshape(1, -1),  # 質問の埋め込みを2次元配列に変換
                np.array(openai_emb).reshape(1, -1)  # データベースからの埋め込みも2次元配列に変換
            )[0, 0]
        )


        # 'similarity' で降順にソート
        df_sorted = df.sort_values(by='similarity', ascending=False)
        
        # 結果を表示
        print(df_sorted)

        # 上位5件のaoyama_kougi_idを取得
        top_ids = df_sorted['aoyama_kougi_id'].head(5).tolist()
        print(top_ids)

        # プレースホルダの数に合わせてクエリを作成
        query = "SELECT 科目 FROM aoyama_ssi_kougi WHERE id IN (%s)" % ','.join(['%s'] * len(top_ids))
        cursor.execute(query, top_ids)
        subjects = cursor.fetchall()

        for subject in subjects:
            print(subject.values())
        
finally:
    if connection.open:
        connection.close()

