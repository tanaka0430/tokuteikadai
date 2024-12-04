from openai import OpenAI
import json
import os
import sys
import time
from dotenv import load_dotenv
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db_config import create_db_connection  # DB接続をインポート

load_dotenv()

# OpenAI APIキーの設定
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# OpenAIクライアントのインスタンスを作成
client = OpenAI(api_key=OPENAI_API_KEY)
# 1. MySQLデータベースから講義情報を取得する
def fetch_lecture_info():
    connection = create_db_connection()
    try:
        with connection.cursor() as cursor:
            # 講義情報を取得するSQLクエリ
            sql = """
                SELECT k.id, k.時限, k.科目, k.教員, k.単位, k.開講, k.学年, k.メッセージ, t.text
                FROM aoyama_kougi k
                LEFT JOIN aoyama_kougi_detail t ON k.id = t.aoyama_kougi_id
            """
            cursor.execute(sql)
            result = cursor.fetchall()
        return result
    finally:
        connection.close()

#プロンプトの改善余地あり
def generate_audience_info(text):
    # メッセージのリストを作成
    messages = [
        {"role": "system", "content": "あなたは教育ガイダンスの専門家です。"},
        {
            "role": "user",
            "content": f"""
                以下の入力に基づいて、講義内容を整理・要約してください。
                出力は出力フォーマットを厳格に守ってください。
                出力フォーマットの項目名に適した内容を出力するようにしてください。
                
                この出力の内容は他の講義との比較に使われるため、重複するであろう部分については含まないでください。
                （「学部・研究科のディプロマポリシー」や「活用される授業方法」の部分など）

                入力の情報量が少ない場合は、講義内容を推測して補完してください。

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

#不要
def raw_audience_info(kamoku, jigen, kyouin, tani, kaiko, gakunen, message, text):

    content=f"""
                科目: {kamoku}
                時限: {jigen}
                教員: {kyouin}
                単位: {tani}
                開講: {kaiko}
                学年: {gakunen}
                メッセージ: {message}
                説明: {text}
            """

    return content.strip() 


def get_embedding(text, retries=5, backoff_factor=1):
    for attempt in range(retries):
        try:
            response = client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error on attempt {attempt + 1}: {e}")
            if attempt < retries - 1:
                wait_time = backoff_factor * (2 ** attempt)
                print(f"Retrying after {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                print("Max retries reached. Raising exception.")
                raise

def store_embedding_in_db(id, text, embedding):
    connection = create_db_connection()
    try:
        with connection.cursor() as cursor:
            # テーブルが存在しない場合は作成
            create_table_query = """
            CREATE TABLE IF NOT EXISTS aoyama_openai_emb (
                aoyama_kougi_id INT PRIMARY KEY,
                audi_text TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,  
                openai_emb JSON
            )
            """
            cursor.execute(create_table_query)

            # 外部キー制約を追加
            try:
                alter_table_query = """
                ALTER TABLE aoyama_openai_emb
                ADD CONSTRAINT fk_aoyama_kougi
                FOREIGN KEY (aoyama_kougi_id) REFERENCES aoyama_kougi(id)
                ON DELETE CASCADE
                """
                cursor.execute(alter_table_query)
            except Exception as e:
                # 外部キー制約がすでに存在する場合は何もしない
                print()
            
            
            # 埋め込みベクトルをJSONとして保存
            embedding_json = json.dumps(embedding)

            # 講義情報にベクトルを追加するSQLクエリ
            sql = """
            INSERT INTO aoyama_openai_emb (aoyama_kougi_id, audi_text, openai_emb)
            VALUES (%s, %s, %s)
            """
            cursor.execute(sql, (id, text, embedding_json))  # embedding_jsonを使用

        connection.commit()
    finally:
        connection.close()

# メイン処理
def main(start_id=None):
    # 処理済みIDを記録するファイル
    progress_file = "progress.txt"

    # 処理済みIDを読み込む
    processed_ids = set()
    if os.path.exists(progress_file):
        with open(progress_file, "r") as f:
            processed_ids = set(map(int, f.read().splitlines()))

    # 1. 講義情報をデータベースから取得
    lectures = fetch_lecture_info()

    for lecture in lectures:
        lecture_id = lecture['id']
        if start_id and lecture_id < start_id:
            continue  # 指定ID未満はスキップ
        if lecture_id in processed_ids:
            print(f"Skipping already processed ID: {lecture_id}")
            continue

        text = lecture['text']

        try:
            # 2. GPT-4を使って最適な受講者像を生成
            audience_info = generate_audience_info(text)
            print(f"Lecture ID: {lecture_id}, Audience Info: {audience_info}")

            # 3. 生成された受講者情報をベクトル化
            embedding = get_embedding(audience_info)

            # 4. ベクトルをデータベースに保存
            store_embedding_in_db(lecture_id, audience_info, embedding)
            print(f"Lecture ID: {lecture_id}, Embedding stored in DB.")
        except Exception as e:
            print(f"Error processing ID {lecture_id}: {e}")
            continue

        # 処理済みIDを記録
        with open(progress_file, "a") as f:
            f.write(f"{lecture_id}\n")

        print()

# 実行
if __name__ == "__main__":
    main()  #止まったら止まった時のidを引数にとる