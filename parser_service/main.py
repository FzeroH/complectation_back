from fastapi import FastAPI

from parser import parser

app = FastAPI()


@app.get("/")
async def root():
    test = parser("/home/alex/IdeaProjects/complectation_back/parser_service/price Инфра-инженерия.xlsx")
    return {"result": test}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
