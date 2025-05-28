-- usersテーブル
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    def_calendar INT,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_name (name)
);

-- aoyama_kougiテーブル
CREATE TABLE IF NOT EXISTS aoyama_kougi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    時限 VARCHAR(255),
    科目 VARCHAR(255),
    教員 VARCHAR(255),
    単位 VARCHAR(255),
    開講 VARCHAR(255),
    学年 VARCHAR(255),
    メッセージ TEXT,
    url TEXT
);

-- aoyama_kougi_detailテーブル
CREATE TABLE IF NOT EXISTS aoyama_kougi_detail (
    aoyama_kougi_id INT PRIMARY KEY AUTO_INCREMENT,
    url text,
    text text
);

-- chat_logテーブル
CREATE TABLE IF NOT EXISTS chat_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    input TEXT,
    generated_input TEXT,
    generated_idlist JSON,
    timestamp DATETIME
);

-- aoyama_openai_embテーブル
CREATE TABLE IF NOT EXISTS aoyama_openai_emb (
    aoyama_kougi_id INT PRIMARY KEY AUTO_INCREMENT,
    audi_text TEXT,
    openai_emb JSON
);

-- user_calendarテーブル
CREATE TABLE IF NOT EXISTS user_calendar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    calendar_name VARCHAR(255),
    campus JSON,
    department JSON,
    semester JSON,
    sat_flag BOOLEAN DEFAULT TRUE,
    sixth_period_flag BOOLEAN DEFAULT TRUE
);

-- user_kougiテーブル
CREATE TABLE IF NOT EXISTS user_kougi (
    calendar_id INT,
    kougi_id INT,
    period VARCHAR(50),
    PRIMARY KEY (calendar_id, kougi_id, period)
);
