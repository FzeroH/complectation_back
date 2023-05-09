import os
from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import pandas as pd

from verifyToken import verify_token
from parser import parser
from db_connect import connect

app = FastAPI()
security = HTTPBearer()


@app.post("/api/file/upload")
async def create_upload_file(
        file: UploadFile = File(...),
        publisher: str = Form(...),
        credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = verify_token(credentials)
        user_id = await payload
        with connect.cursor() as curs:
            select_role_name = f"SELECT users_id, users.role_id FROM users JOIN role ON users.role_id = role.role_id WHERE users_id = {user_id}"
            curs.execute(select_role_name)
            role = curs.fetchone()
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"{e}")
    if role[1] == 3:
        if not file.filename.lower().endswith(('.xls', '.xlsx')):
            return JSONResponse(content={"error": "Неверный формат файла."}, status_code=400)

        # сохраняем загруженный файл с заданным именем
        file_type = f"{os.path.splitext(file.filename)[1]}"
        file_path = f"{publisher}{file_type}"

        contents = await file.read()
        with open(file_path, 'wb') as f:
            f.write(contents)
        try:
            pd.read_excel(file_path)
        except:
            return JSONResponse(content={"error": "Недопустимый файл."}, status_code=400)

        t = parser(publisher, file_path)

        os.remove(file_path)

        return JSONResponse(content={"message": "Успешно"}, status_code=200)
    else:
        return JSONResponse(content={"error": "У Вас нет права загрузки файла"}, status_code=403)