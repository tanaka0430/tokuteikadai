from db_config import create_db_connection  # DB接続をインポート
import faiss
import numpy as np
import pandas as pd
import ast

index = faiss.IndexFlatL2(1536)
connection = create_db_connection()
try:
    with connection.cursor() as cursor:
        # 講義情報を取得するSQLクエリ
        sql = """
            select aoyama_kougi_id,openai_emb from aoyama_openai_emb
        """
        cursor.execute(sql)
        result = cursor.fetchall()
        df = pd.DataFrame(result, columns=['aoyama_kougi_id', 'openai_emb'])
        

        # 'emb' をリストに変換し、numpy配列に変換
        def decode_and_convert(x):
            if isinstance(x, bytes):
                x = x.decode('utf-8')  # bytesをstrにデコード
            return np.array(ast.literal_eval(x)).reshape(1, -1)

        df['openai_emb'] = df['openai_emb'].apply(decode_and_convert)
        two_d_list = [arr.flatten().tolist() for arr in df['openai_emb'].tolist()]
        emb = np.array(two_d_list).astype('float32')

        index.add(emb)
        faiss.write_index(index,"faiss_index.bin")

        
finally:
    connection.close()

