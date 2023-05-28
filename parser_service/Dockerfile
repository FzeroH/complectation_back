# Указываем базовый образ
FROM python:3.9-slim

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем зависимости в контейнер
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код в контейнер
COPY . .

# Определяем переменные среды
ENV PORT=8000
ENV HOST=0.0.0.0

# Открываем порт, на котором будет работать приложение
EXPOSE ${PORT}

# Запускаем приложение
CMD ["uvicorn", "main:app", "--host", "${HOST}", "--port", "${PORT}"]
