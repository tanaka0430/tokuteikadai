##  プロジェクト概要
青山学院大学のシラバスを自然言語で検索し、カレンダーに登録できるWebアプリ。

2024年度特定課題演習情報システム開発班にて開発。

<br />

##  アプリケーションのURL
http://agu-syllabus.ddo.jp/

<br />

##  機能一覧
<table style="width:100%; text-align:center;">
  <tr>
    <th>ユーザー登録画面</th>
    <th>ログイン画面</th>
  </tr>
  <tr>
    <td><img src="" alt="ユーザー登録画面"></td>
    <td><img src="" alt="ログイン画面"></td>
  </tr>
  <tr>
    <td>ログインIDとパスワードでのユーザー登録機能。IDは一意である必要がある。</td>
    <td>ログインIDとパスワードでの認証機能。</td>
  </tr>
  <tr>
    <th>ホーム画面</th>
    <th>カレンダー設定画面</th>
  </tr>
  <tr>
    <td><img src="" alt="ホーム画面"></td>
    <td><img src="" alt="カレンダー設定画面"></td>
  </tr>
  <tr>
    <td>登録した講義の確認や削除機能。</td>
    <td>カレンダーの作成、更新、削除機能。</td>
  </tr>
  <tr>
    <th>チャット検索画面</th>
    <th>絞り込み検索画面</th>
  </tr>
  <tr>
    <td><img src="" alt="チャット検索画面"></td>
    <td><img src="" alt="絞り込み検索画面"></td>
  </tr>
  <tr>
    <td>自然言語でのシラバス検索機能。</td>
    <td><a href="https://syllabus.aoyama.ac.jp/">本家のシラバス検索サイト</a>と同じように検索できる機能。</td>
  </tr>
</table>

画像は完成後に挿入
<br />

##  主要技術
| Category          | Technology Stack                                     |
| ----------------- | --------------------------------------------------   |
| Frontend          | JavaScript, React                                    |
| Backend           | Python, FastAPI, Uvicorn, SQLAlchemy, Uvicorn        |
| AI Services       | OpenAI API                                           |
| Infrastructure    | Amazon Web Services, Nginx, Dynamic DO!.jp           |
| Database          | MySQL, FAISS (Vector Database)                       |
| Test              |                                                      |
| Design            |                                                      |
| etc.              |Git, GitHub                                           |

<br />

##  システム構成図

![システム構成図](/docs/img/awsシステム構成図.png)
（実際の構成に合わせて修正する）

<br />

##  ER図

![ER構成図](/docs/img/tokuteikadai_ER.png)

<br />

##  環境構築
後で書く
#### nginxの設定ファイル
#### 詰まりがちなポイントの解決法
<br />

##  運用方法
後で書く
#### スクレイピングの注意点
<br />

## 今後の展望（いらないかも）
<br />

## readmeを書くのに参考になるサイト（最後に消す）
・https://zenn.dev/bloomer/articles/3f73f7d02e5a63

・https://github.com/ren-ichinose/Accel

・https://www.whaletech.co.jp/blog/readme-markdown-1/

<br />
