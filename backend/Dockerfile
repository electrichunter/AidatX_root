FROM python:3.12-slim

# Sistem bağımlılıkları
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Önce bağımlılıkları kur (cache optimizasyonu)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Kaynak kodu kopyala
COPY . .

EXPOSE 8000

# Uvicorn ile başlat
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
