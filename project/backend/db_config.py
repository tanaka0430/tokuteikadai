import os
import pymysql
from dotenv import load_dotenv

# ec２サーバーで作成した.envファイルを読み込む。.envはgitignoreに追加
load_dotenv()

# データベース接続の設定
dbConfig = {
    "host": os.getenv("DB_HOST"),
    "port": int(os.getenv("DB_PORT")),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
    "charset": "utf8"
}

def create_db_connection():
    """MySQLに直接接続するユーティリティ関数"""
    connection = pymysql.connect(
        host=dbConfig["host"],
        port=dbConfig["port"],
        user=dbConfig["user"],
        password=dbConfig["password"],
        database=dbConfig["database"],
        charset=dbConfig["charset"],
        cursorclass=pymysql.cursors.DictCursor
    )
    return connection

# データベース接続をテスト
if __name__ == "__main__":
    connection = create_db_connection()
    print("データベースに接続しました。")
    connection.close()
