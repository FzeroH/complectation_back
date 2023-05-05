import pandas as pd
import json

def parser(path_to_excel_file):
    # загружаем данные из Excel файла в DataFrame
    df = pd.read_excel(path_to_excel_file, header=10)
    # Нумерация с 0, поэтому брать расположение названий столбцов на строку меньше, чем в xls/xlsx файле
    # ТНТ 5, Кнорус 5, Питер 6, Лаборатория знаний 4,Проспект новый 11, АСВ 3, ИнфраИнж 10
    # создаем словарь с ключами, соответствующими ожидаемым названиям столбцов,
    # и значениями, соответствующими возможным названиям столбцов в файле Excel
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
    print(f'{json_data[1]["publication_author"]} {json_data[1]["publication_cost"]}')
    return json_data
