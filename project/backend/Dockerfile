FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN apt-get update && apt-get install -y netcat-openbsd curl && rm -rf /var/lib/apt/lists/* && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

COPY . /app

RUN chmod +x /app/wait-for-it.sh

CMD ["/app/wait-for-it.sh", "db", "3306", "--", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
