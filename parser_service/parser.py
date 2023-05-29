import pandas as pd
import json
from db_connect import connect
import re


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
                  'publication_cost': ['Цена', 'Цена (руб.)', 'Цена с НДС', 'Цена в рублях', 'цена']}

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
    # return json_data
    curs = connect.cursor()
    insert_query = "INSERT INTO publication (company_id,publication_author, publication_title, publication_year, publication_cost) VALUES (%s, %s, %s, %s, %s)"
    try:
        with connect:
            for data in json_data:
                if isinstance(data['publication_year'], str):
                    temp = re.search(r"\d{4}", data['publication_year'])
                    if temp:
                        data['publication_year'] = temp.group()
                if data['publication_year']:
                    data['publication_year'] = str(int(data['publication_year']))

                publication_cost_exceptions = ['готовится к изданию', 'ожидается переиздание', 'ожидается пееиздание',
                                               'не для подажи', 'не для продажи', 'в электонном виде', 'в электронном виде']
                if isinstance(data['publication_cost'], str) and data['publication_cost'].lower() in publication_cost_exceptions:
                    continue
                if isinstance(data['publication_cost'], str) and 'р' in data['publication_cost']:
                    data['publication_cost'] = data['publication_cost'].replace('р', '').strip()
                if isinstance(data['publication_cost'], str) and 'комплект' in data['publication_cost']:
                    data['publication_cost'] = data['publication_cost'].replace('комплект', '').strip()
                if isinstance(data['publication_cost'], str) and ',' in data['publication_cost']:
                    data["publication_cost"] = float(data['publication_cost'].replace(',', '.'))
                if data['publication_cost'] is not None and not isinstance(data['publication_cost'], str):
                    data['publication_cost'] = float(data['publication_cost'])

                if not data['publication_author']:
                    data['publication_author'] = '-'

                if not (data['publication_cost'] and data['publication_year']):
                    continue

                if not data['publication_title']:
                    continue

                values = (6, data['publication_author'], data['publication_title'], data['publication_year'], data['publication_cost'])
                curs.execute(insert_query, values)
    except Exception as e:
        connect.rollback()
        print(f"Error processing data: {e}")
    else:
        connect.commit()
    finally:
        curs.close()
