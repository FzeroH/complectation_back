import pandas as pd
import json
from db_connect import connect


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
                  'publication_name': ['Название', 'Наименование'],
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
        for data in json_data:
            data['publication_year'] = int(data['publication_year'])
            insert_query = f"INSERT INTO mytable (publication_author, publication_name, publication_year, publication_cost) VALUES ('{data['publication_author']}', '{data['publication_name']}', {data['publication_year']}, {data['publication_cost']})"
            curs.execute(insert_query)
    return json_data
