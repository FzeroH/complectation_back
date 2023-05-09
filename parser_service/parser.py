import pandas as pd
import json
from db_connect import connect
from fastapi.responses import JSONResponse


def parser(filename: str, filepath: str):
    header_dict = {
        "Инфра-инженерия": 10,
        "ТНТ": 5,
        "АСВ": 3,
        "Кнорус": 5,
        "Питер": 6,
        "Лаборатория знаний": 4,
        "Проспект": 11
    }
    header = header_dict.get(filename)
    df = pd.read_excel(f"{filepath}", header=header)

    # Нумерация с 0, поэтому брать расположение названий столбцов на строку меньше, чем в xls/xlsx файле

    column_map = {'publication_author': ['Автор', 'Автор(ы)'],
                  'publication_title': ['Название', 'Наименование'],
                  'publication_year': ['Год издания', 'Год'],
                  'publication_cost': ['Цена', 'Цена (руб.)', 'Цена с НДС', 'Цена в рублях']}

    # выбираем только столбцы, которые соответствуют ключам словаря column_map
    columns_to_keep = []
    for key in column_map:
        for value in column_map[key]:
            if value in df.columns:
                columns_to_keep.append(value)
    df = df[columns_to_keep]

    # переименовываем столбцы на ожидаемые названия
    df = df.rename(columns={v: k for k, values in column_map.items() for v in values if v in df.columns})
    # удаляем строки, в которых все значения являются NaN
    df.dropna(how='all', inplace=True)
    df.reset_index(drop=True, inplace=True)

    json_obj = df.to_json(orient='records', force_ascii=False)
    json_data = json.loads(json_obj)
    with connect.cursor() as curs:
        insert_query = "INSERT INTO publication (company_id,publication_author, publication_title, publication_year, publication_cost) VALUES (%s, %s, %s, %s, %s)"
    for data in json_data:
        try:
            if data['publication_year'] is not None:
                data['publication_year'] = str(int(data['publication_year']))
            if data['publication_cost'] is not None:
                data['publication_cost'] = float(data['publication_cost'])
            #TODO: Добавить проверки для каждого поля. Если None, изменить на null
            values = (2, data['publication_author'], data['publication_title'], data['publication_year'], data['publication_cost'])
            curs.execute(insert_query, values)
        except Exception as e:
            print(f"Error processing data {data}: {e}")
            continue
    connect.commit()

    return JSONResponse(content={"message": "Успешно"}, status_code=200)


# try:
    #     with connect.cursor() as curs:
    #         for data in json_data:
    #             if data['publication_year'] is not None:
    #                 data['publication_year'] = str(int(data['publication_year']))
    #             if data['publication_cost'] is not None:
    #                 data['publication_cost'] = float(data['publication_cost'])
    #             insert_query = f"INSERT INTO publication (company_id,publication_author, publication_title, publication_year, publication_cost) VALUES (1, '{data['publication_author']}', '{data['publication_title']}', {data['publication_year']}, {data['publication_cost']})"
    #             curs.execute(insert_query)
    #         curs.commit()
    #     return JSONResponse(content={"message": "Успешно"}, status_code=200)
    # except Exception as e:
    #     return JSONResponse(content={"error": f"{e}"}, status_code=400)
