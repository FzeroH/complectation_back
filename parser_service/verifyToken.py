import os

from fastapi import Header, HTTPException
from typing import Optional
from dotenv import load_dotenv
import jwt

load_dotenv()
JWT_SECRET = os.getenv('JWT_SECRET')


async def verify_token(authorization: Optional[str] = Header(None)) -> int:
    if not authorization:
        raise HTTPException(status_code=401, detail="Токен не найден")

    token_type, token = authorization.split()
    if token_type.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Тип токена должен быть Bearer")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Неверный токен")
        return user_id
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Неверный токен")
