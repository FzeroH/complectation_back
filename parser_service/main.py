import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import pandas as pd

from parser import parser

app = FastAPI()

@app.get("/{filename}/{id}")
async def test(filename, id):
    test = parser(f"{filename}")
    return {"message": test[int(id)]}

@app.post("/api/file/upload")
async def create_upload_file(file: UploadFile = File(...), publisher: str = Form(...)):
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

    return {"filename": file.filename, "publisher": publisher, "test": t}

