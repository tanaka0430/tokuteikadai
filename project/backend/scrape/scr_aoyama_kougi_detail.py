from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from bs4 import BeautifulSoup
import time
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db_config import create_db_connection  # DB接続をインポート

#このスクレイピングはscr_aoyama_kougiのスクレイピングが完了した後に実行

# WebDriverのオプションを設定
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # ヘッドレスモードで実行
driver = webdriver.Chrome(options=options)

# 詳細ページからデータをスクレイピングする関数
def scrape_detail_page():
    connection = create_db_connection()
    data_to_insert = []  # バルク挿入用のリストを作成
    try:
        with connection.cursor() as cursor:
            # テーブル作成を呼び出し
            create_table_if_not_exists(cursor)

            # データベースからURLを取得
            cursor.execute("SELECT id, url FROM aoyama_kougi WHERE url IS NOT NULL")
            urls = cursor.fetchall()
            for url_entry in urls:
                aoyama_kougi_id = url_entry['id']
                url = url_entry['url']
                driver.get(url)

                # ページが読み込まれるのを待つ
                try:
                    WebDriverWait(driver, 60).until(
                        EC.presence_of_element_located((By.TAG_NAME, 'body'))  # bodyが読み込まれるのを待つ
                    )
                except TimeoutException:
                    print(f"タイムアウト: URL読み込み失敗: {url}")
                    continue  # タイムアウトした場合は次のURLにスキップ

                # スクレイピング開始
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                all_text = soup.get_text(separator=' ', strip=True)  # 全テキストを取得

                # データをバルク挿入用リストに追加
                data_to_insert.append((aoyama_kougi_id, url, all_text))
                time.sleep(1)
                print(aoyama_kougi_id)

        # バルク挿入
        insert_data_to_db(connection, data_to_insert)

    finally:
        connection.close()


def create_table_if_not_exists(cursor):
    """ テーブルを作成する関数 """
    create_table_query = """
    CREATE TABLE IF NOT EXISTS aoyama_kougi_detail (
        aoyama_kougi_id INT PRIMARY KEY,  
        url TEXT,
        text TEXT
    );
    """
    cursor.execute(create_table_query)
    
        # 外部キー制約を追加
    try:
        alter_table_query = """
        ALTER TABLE aoyama_kougi_detail 
        ADD CONSTRAINT fk_aoyama_kougi
        FOREIGN KEY (aoyama_kougi_id) REFERENCES aoyama_kougi(id)
        ON DELETE CASCADE
        """
        cursor.execute(alter_table_query)
    except Exception as e:
        # 外部キー制約がすでに存在する場合は何もしない
        print(f"外部キー制約の追加中にエラーが発生しました: {e}")


def insert_data_to_db(connection, data_to_insert):
    with connection.cursor() as cursor:
        # バルク挿入用のクエリを作成
        insert_query = """
        INSERT INTO aoyama_kougi_detail (
            aoyama_kougi_id, url, text)
        VALUES (%s, %s, %s)
        """

        # データの構造を確認
        print(f"挿入するデータの数: {len(data_to_insert)}:")

        # バルク挿入を実行
        cursor.executemany(insert_query, data_to_insert)

        # コミットして変更を反映
        connection.commit()


# スクレイピングを実行
scrape_detail_page()

# 終了
driver.quit()
