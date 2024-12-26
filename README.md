##  プロジェクト概要
青山学院大学のシラバスを自然言語で検索し、カレンダーに登録できるWebアプリ。

2024年度特定課題演習情報システム開発班にて開発。

<br />

##  アプリケーションのURL
http://agu-syllabus.ddo.jp/

<br />

##  機能一覧
| ユーザー登録画面                           | ログイン画面                           |
|-------------------------------------------|----------------------------------------|
| ![ユーザー登録画面](/docs/img/アプリ画面/ユーザー登録画面.png) | ![ログイン画面](/docs/img/アプリ画面/ログイン画面.png) |
| ログインIDとパスワードでのユーザー登録機能。IDは一意である必要がある。 | ログインIDとパスワードでの認証機能。 |

| ホーム画面                                 | 時間割作成画面                          |
|-------------------------------------------|----------------------------------------|
| ![ホーム画面](/docs/img/アプリ画面/ホーム画面.png)         | ![時間割作成画面](/docs/img/アプリ画面/時間割作成画面.png) |
| 登録した講義の確認や削除機能。                      | 時間割の作成機能。                              |

| 時間割設定更新画面                          | 時間割一覧画面                          |
|-------------------------------------------|----------------------------------------|
| ![時間割設定更新画面](/docs/img/アプリ画面/時間割設定更新画面.png) | ![時間割一覧画面](/docs/img/アプリ画面/時間割一覧画面.png) |
| 時間割設定の更新機能。                           | 時間割の指定、削除機能。                         |

| 講義検索画面                              | チャット検索画面                          |
|-------------------------------------------|----------------------------------------|
| ![講義検索画面](/docs/img/アプリ画面/講義検索画面.png)       | ![チャット検索画面](/docs/img/アプリ画面/チャット検索画面.png) |
| [本家のシラバス検索サイト](https://syllabus.aoyama.ac.jp/)と同じように検索できる機能。 | 自然言語でのシラバス検索機能。                   |




<br />

##  主要技術
| Category          | Technology Stack                                     |
| ----------------- | --------------------------------------------------   |
| Frontend          | JavaScript, React                                    |
| Backend           | Python, FastAPI, Uvicorn, SQLAlchemy                 |
| AI Services       | OpenAI API                                           |
| Infrastructure    | Amazon Web Services, Nginx                           |
|                   | Let's Encrypt, Dynamic DO!.jp                        |
| Database          | MySQL, FAISS (Vector Database), Redis                |
| Test              | pytest                                               |
| Design            | MUI                                                  |
| etc.              | Git, GitHub                                          |

<br />

##  システム構成図

![システム構成図](/docs/img/awsシステム構成図.png)

<br />

##  ER図

![ER構成図](/docs/img/tokuteikadai_ER.png)

<br />

## テーブル解説

後で書く

<br />

## API解説

後で書く

<br />

## 自然言語検索の仕組み

![チャット検索の仕組み](/docs/img/チャット検索の仕組み.png)

<br />

##  環境構築
後で書く<br>
git clone(/home/ec2-user/配下は注意)<br>
apiのパス修正（変えてcommitすべきかも）<br>

dumpでDB構築<br>

python pip install<br>
myenv<br>
requirements.txt<br>
.env<br>
nginx<br>
　start<br>
　設定ファイル<br>
　権限（701）<br>
node.js react<br>
　スワップ領域<br>
　npm install<br>
　react build<br>
uvicorn<br>
　自動起動
<br />

##  注意事項
#### スクレイピング
後で書く<br>
スクレイピングの順番<br>
年度からむの追加<br>
faiss_index.binは年度で絞ってから　
<br />

## 今後の展望（いらないかも）
<br />

## readmeを書くのに参考になるサイト（最後に消す）
・https://zenn.dev/bloomer/articles/3f73f7d02e5a63

・https://github.com/ren-ichinose/Accel

・https://www.whaletech.co.jp/blog/readme-markdown-1/

<br />
