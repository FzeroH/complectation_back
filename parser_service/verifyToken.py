import os

from fastapi import Header, HTTPException
from typing import Optional
from dotenv import load_dotenv
import jwt

load_dotenv()
JWT_SECRET = os.getenv('JWT_SECRET')


async def verify_token(authorization: Optional[str]=Header(None)) -> int:
    jwt_options = {
        'verify_signature': False,
        'verify_exp': True,
        'verify_nbf': False,
        'verify_iat': True,
        'verify_aud': False
    }

    if not authorization:
        raise HTTPException(status_code=401, detail="Токен не найден")

    token_type, token = authorization.scheme, authorization.credentials
    if token_type.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Тип токена должен быть Bearer")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"], options=jwt_options)
        user_id = payload.get("userId")
        if not user_id:
            raise HTTPException(status_code=401, detail="Неверный токен")
        return user_id
    except jwt.PyJWTError as e:
        print(f"{e}")
        raise HTTPException(status_code=401, detail=f"{e}")
