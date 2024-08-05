from fastapi import FastAPI, Request, Form
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from db_config import create_db_connection

app = FastAPI()

# Jinja2のテンプレートディレクトリを定義
templates = Jinja2Templates(directory="templates")


@app.get("/users")
async def get_users_count(request: Request):
    # SSHトンネルを通じてMySQLに接続
    connection = create_db_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS user_count FROM users")
            result = cursor.fetchone()
            user_count = result["user_count"]
    finally:
        connection.close()

    
    # index.htmlテンプレートをレンダリングし、ユーザー数を渡す
    return templates.TemplateResponse("users.html", {"request": request, "users_count": user_count})

@app.post("/register")
async def register_user(
    name: str = Form(...),
    email: str = Form(...),
    birthday: str = Form(...),
    gender: str = Form(...)
):
    # SSHトンネルを通じてMySQLに接続
    connection = create_db_connection()
    
    try:
        with connection.cursor() as cursor:
            query = """
            INSERT INTO users (name, email, birthday, gender)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(query, (name, email, birthday, gender))
            connection.commit()
    finally:
        connection.close()

    
    # ユーザー登録後に/usersエンドポイントにリダイレクト
    return RedirectResponse(url="/users", status_code=303)

