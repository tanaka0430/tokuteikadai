##  プロジェクト概要
青山学院大学のシラバスを自然言語で検索し、カレンダーに登録できるWebアプリ。

2024年度特定課題演習情報システム開発班にて開発。

<br /><br />

**本readmeよりも、以下のnotebooklmの方がわかりやすいかもしれません。**
<br />
https://notebooklm.google.com/notebook/c3771887-9a8f-496e-bbf9-14cb119e656d

<br />

## dockerのセットアップ手順
[dockerのセットアップ手順書](/docs/setup.md)

<br />

##  アプリケーションのURL
https://agu-syllabus.ddo.jp/

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

---

### 1. **aoyama_kougi**
- **目的**: 青山学院大学の講義情報を管理するテーブルです。
- **主なフィールド**:
  - `id`: 講義を一意に識別するための主キー。
  - `時限`: 講義の時間帯（例: 月曜1限など）。
  - `科目`: 講義の科目名。
  - `教員`: 担当教員の名前。
  - `単位`: その講義で取得できる単位数。
  - `開講`: 開講状況（例: 前期、後期など）。
  - `学年`: 対象学年。
  - `メッセージ`: 講義に関する補足情報。
  - `url`: 講義に関連する追加情報のURL。

---

### 2. **aoyama_kougi_detail**
- **目的**: 各講義の詳細な情報を保存します。
- **主なフィールド**:
  - `aoyama_kougi_id`: `aoyama_kougi` テーブルの主キーを参照する外部キー。
  - `url`: 追加詳細情報へのリンク（`aoyama_kougi.url`と同じ）。
  - `text`: リンク先をスクレイピングした生データ。

---

### 3. **aoyama_openai_emb**
- **目的**: OpenAI を用いて講義データをベクトル化し、検索や推薦機能を強化します。
- **主なフィールド**:
  - `aoyama_kougi_id`: `aoyama_kougi` テーブルの主キーを参照する外部キー。
  - `audi_text`: `aoyama_kougi.text`を要約したデータ。
  - `openai_emb`: OpenAI による`audi_text`のベクトルデータ。

---

### 4. **users**
- **目的**: システム利用者を管理するためのテーブルです。
- **主なフィールド**:
  - `id`: ユーザーを一意に識別するための主キー。
  - `name`: ユーザーの名前。
  - `password`: ハッシュ化されたパスワード。
  - `def_calendar`: デフォルトのカレンダー設定。
  - `is_active`: ユーザーがアクティブかどうかを示すフラグ。

---

### 5. **user_calendar**
- **目的**: ユーザーごとのカレンダー情報を管理します。
- **主なフィールド**:
  - `id`: カレンダーを一意に識別するための主キー。
  - `user_id`: `users` テーブルの主キーを参照する外部キー。
  - `calendar_name`: カレンダー名。
  - `campus`: 青山または相模原キャンパスの選択。
  - `department`: 所属学科。
  - `semester`: 対象学期。
  - `sat_flag`: 土曜日の講義を表示するかどうかのフラグ。
  - `sixth_period_flag`: 6限目を表示するかどうかのフラグ。

---

### 6. **user_kougi**
- **目的**: ユーザーがカレンダーに追加した講義情報を管理します。
- **主なフィールド**:
  - `calendar_id`: `user_calendar` テーブルの主キーを参照する外部キー。
  - `kougi_id`: `aoyama_kougi` テーブルの主キーを参照する外部キー。
  - `period`: その講義がカレンダー内で配置される時限。

---

### 7. **chat_log**
- **目的**: チャット履歴を管理します。ユーザーの入力内容とその結果を保存します。
- **主なフィールド**:
  - `id`: ログエントリを一意に識別するための主キー。
  - `user_id`: `users` テーブルの主キーを参照する外部キー。
  - `input`: ユーザーが入力した内容。
  - `generated_input`: AIが生成した整形済みの入力。
  - `generated_idlist`: 検索結果として返されたIDリスト。
  - `timestamp`: 入力日時。

---

<br />

## API解説

swaggerのAPI仕様書(サーバ起動中のみ)
[https://agu-syllabus.ddo.jp/api/](https://agu-syllabus.ddo.jp/api/)

（内容が少し古い）
[https://tanaka0430.github.io/tokuteikadai/](https://tanaka0430.github.io/tokuteikadai/)


<br />

## 自然言語検索の仕組み

![チャット検索の仕組み](/docs/img/チャット検索の仕組み.png)

<br />


##  注意事項・課題点
・`/home/ec2-user/`に本リポジトリを配置してしまったので、`nginx` などのサービスと権限の問題が発生しやすい。<br>
<br />

・シラバスの更新に対応できていない。<br>
→`aoyama_kougi`テーブルに年度カラムを追加して、idと年度の複合主キーとする必要がある。<br>
→`aoyama_kougi`テーブルを呼び出すテーブルや関数も修正が必要。<br>
→`faiss_index.bin`も年度ごとに作成する必要がある。<br>
<br />

・`npm install`に時間が掛かり過ぎる場合は、スワップ領域を設定する必要がある（そもそもnode_moduleをリポジトリに含めるべきじゃない）。<br>
<br />

・複数のクライアントが同時にAPIを呼び出すと処理に時間が掛かる。<br>
→非同期処理を実装するべき。<br>

<br />
