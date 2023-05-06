import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_LOGIN = os.getenv('DB_LOGIN')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

try:
    connect = psycopg2.connect(dbname=DB_NAME, user=DB_LOGIN, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
except:
    print("Ошибка. Подключение не удалось.")