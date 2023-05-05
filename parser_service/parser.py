import pandas as pd

# указываем путь к файлу Excel
path_to_excel_file = "/home/alex/IdeaProjects/is_complectation_backend/parser_service/Прайс  АСВ 01.02.2023.xls"

# загружаем данные из Excel файла в DataFrame
df = pd.read_excel(path_to_excel_file, header=3)

# создаем словарь с ключами, соответствующими ожидаемым названиям столбцов,
# и значениями, соответствующими возможным названиям столбцов в файле Excel
column_map = {'author': ['Автор', 'Автор(ы)'],
              'name': ['Название', 'Наименование'],
              'year': ['Год издания', 'Год']}

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
print(json_obj)