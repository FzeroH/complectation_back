const { db } = require('../configs/postgresConfig');
const bcrypt = require('bcryptjs');
const TablesSchema = require('../schema/TablesSchema');
const UsersSchema = require('../schema/UsersSchema');
const CompanySchema = require('../schema/CompanySchema');
const StudentsGroupSchema = require('../schema/StudentsGroupSchema');
const StudentsDisciplineSchema = require('../schema/StudentsDisciplineSchema');
const DisciplineSchema = require('../schema/DisciplineSchema');


const schemas = {
    users: UsersSchema,
    company:CompanySchema,
    students_group: StudentsGroupSchema,
    students_discipline: StudentsDisciplineSchema,
    discipline: DisciplineSchema
};

const columnSchemas = {
    users: {
        title: 'Роль пользователя',
        name:'role_id',
        type: 'number',
        list: async () => {
            return await db.many(`SELECT role_id as value, role_name as title FROM role`);
        }
    },
    discipline: {
        title: 'Кафедра',
        name:'cafedra_id',
        type:'number',
        list: async ()=> {
            return await db.many(`SELECT cafedra_id as value, cafedra_name as title FROM cafedra`);
        }
    },
    students_discipline: [
        {
            title: 'Предмет',
            name:'discipline_id',
            type: 'number',
            list: async ()=> {
                return await db.many(`SELECT discipline_id as value, discipline_name as title FROM discipline`);
            }
        },
        {
            title: 'Преподаватель',
            name:'users_id',
            type: 'number',
            list: async ()=> {
               return await db.many(`SELECT users_id as value, users_first_name || ' ' || users.users_last_name title 
                    FROM users WHERE role_id = 2`);
            }
        },
        {
            title: 'Группа',
            name:'students_group_id',
            type: 'number',
            list: async ()=> {
                return await db.many(`SELECT students_group_id as value, students_group_name as title FROM students_group`);
            }
        },
    ],
    students_group: [
        {
            title: 'Кафедра',
            name:'cafedra_id',
            type: 'number',
            list: async ()=> {
                return await db.many(`SELECT cafedra_id as value, cafedra_name as title FROM cafedra`);
            }
        },
        {
            title: 'Тип группы',
            name:'students_group_type_id',
            type: 'number',
            list: async ()=> {
                return await db.many(`SELECT students_group_type_id as value, students_group_type_name as title FROM students_group_type`);
            }
        },
    ]

}

module.exports.getTables = async function (req, res){
    try {
        const { tables } = TablesSchema
        res.status(200).json(tables);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
};

module.exports.getColumns = async function (req, res){
    const { tableName } = req.query;
    try {
        const tableSchema = schemas[tableName];
        if (!tableSchema) {
            throw new Error(`Schema not found for table: ${tableName}`);
        }
        const { tableHeaders } = tableSchema;

        // Добавляем элементы из columnSchemas, если они доступны
        if (columnSchemas.hasOwnProperty(tableName)) {
            const columns = columnSchemas[tableName];
            if (Array.isArray(columns)) {
                // Если columns является массивом, добавляем каждый элемент отдельно
                for (const column of columns) {
                    const { title, name, type, list } = column;
                    if (typeof list === 'function') {
                        const elements = await list(); // Вызываем функцию list и получаем результат
                        tableHeaders.push({
                            title,
                            name,
                            type,
                            list: elements
                        });
                    }
                }
            } else {
                // Если columns является объектом, добавляем его целиком
                const { title, name, type, list } = columns;
                if (typeof list === 'function') {
                    const elements = await list(); // Вызываем функцию list и получаем результат
                    tableHeaders.push({
                        title,
                        name,
                        type,
                        list: elements
                    });
                }
            }
        }
        res.json(tableHeaders);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
};

// ===== Получение списков =====
module.exports.getUsers = async function (req, res){
    const { sorting : sort } = req.query
    const field = sort?.field ?? 'users_id';
    const direction = sort?.direction ?? 'asc';

    try {
        const result = await db.many(`SELECT users_id, users_first_name, users_last_name, users_email, users.role_id 
                FROM users JOIN role ON users.role_id = role.role_id ORDER BY ${field} ${direction}`, { field, direction });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
};

module.exports.getStudentsDiscipline = async function (req, res){
    const { sorting : sort } = req.query
    const field = sort?.field ?? 'students_discipline_id';
    const direction = sort?.direction ?? 'asc';

    try {
        const result = await db.many(`SELECT students_discipline_id, sd.discipline_id, sd.students_group_id,
                                    sd.users_id, students_discipline_semester
                                    FROM students_discipline as sd JOIN users as us ON sd.users_id = us.users_id
                                    JOIN discipline as ds ON sd.discipline_id = ds.discipline_id
                                    JOIN students_group as sg ON sd.students_group_id = sg.students_group_id 
                                    ORDER BY ${field} ${direction}`, { field, direction });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.getCompany = async function (req, res){
    const { sorting : sort } = req.query
    const field = sort?.field ?? 'company_id';
    const direction = sort?.direction ?? 'asc';

    try {
        const result = await db.many(`SELECT company_id , company_name FROM company 
                                    ORDER BY ${field} ${direction}`, { field, direction });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.getStudentsGroup = async function (req, res){
    const { sorting : sort } = req.query
    const field = sort?.field ?? 'students_group_id';
    const direction = sort?.direction ?? 'asc';

    try {
        const result = await db.many(`SELECT students_group_id, sg.cafedra_id, sg.students_group_type_id, students_group_name, students_group_count
                                    FROM students_group as sg JOIN cafedra as cf ON sg.cafedra_id = cf.cafedra_id
                                    JOIN students_group_type as sgt ON sg.students_group_type_id = sgt.students_group_type_id 
                                    ORDER BY ${field} ${direction}`, { field, direction });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.getDiscipline = async function (req, res){
    const { sorting : sort } = req.query
    const field = sort?.field ?? 'discipline_id';
    const direction = sort?.direction ?? 'asc';

    try {
        const result = await db.many(`SELECT discipline_id, sd.cafedra_id, discipline_name FROM discipline as sd
                                    JOIN cafedra as cf ON sd.cafedra_id = cf.cafedra_id 
                                    ORDER BY ${field} ${direction}`, { field, direction });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

// ===== Обновление данных =====
module.exports.changeUser = async function (req, res){
    const { payload : pd } = req.body
    try {
        await db.none(`UPDATE public.users
                       SET role_id=$2, users_first_name=$3, users_last_name=$4, users_email=$5
                       WHERE users_id=$1;`, { pd });
        res.status(200).json("Успешно");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.changeStudentsDiscipline = async function (req, res){
    const { payload : pd } = req.body
    try {
        await db.none(`UPDATE public.students_discipline 
                SET discipline_id=$2, students_group_id=$3, users_id=$4, 
                    students_discipline_semester=$5
                WHERE students_discipline_id=$1;`, { pd });
        res.status(200).json("Успешно");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.changeCompany = async function (req, res){
    const { payload : pd } = req.body
    try {
        await db.none(`UPDATE public.discipline
                       SET company_name=$2
                       WHERE company_id = $1;`, { pd });
        res.status(200).json("Успешно");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.changeStudentsGroup = async function (req, res){
    const { payload : pd } = req.body
    try {
        await db.none(`UPDATE public.students_group
                       SET cafedra_id=$2, students_group_type_id=$3, 
                           students_group_name=$4, students_group_count=$5
                       WHERE students_group_id=$1;`, { pd });
        res.status(200).json("Успешно");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.changeDiscipline = async function (req, res){
    const { payload } = req.body

    try {
        await db.none(`UPDATE public.discipline
                       SET cafedra_id=$2, discipline_name=$3
                       WHERE discipline_id = $1;`, { payload });
        res.status(200).json("Успешно");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

// ===== Добавление данных =====
module.exports.addUser = async function (req, res) {
    const { payload: pd } = req.body;
    try {
        await db.none(`INSERT INTO public.users (role_id, users_first_name, users_last_name, users_email)
                       VALUES ($1, $2, $3, $4);`, [pd.role_id, pd.users_first_name, pd.users_last_name, pd.users_email]);
        res.status(200).json("Успешно");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.addStudentsDiscipline = async function (req, res) {
    const { payload: pd } = req.body;
    try {
        await db.none(`INSERT INTO public.students_discipline 
                       (discipline_id, students_group_id, users_id, students_discipline_semester)
                       VALUES ($1, $2, $3, $4);`, [pd.discipline_id, pd.students_group_id, pd.users_id, pd.students_discipline_semester]);
        res.status(200).json("Успешно");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.addCompany = async function (req, res) {
    const { payload: pd } = req.body;
    try {
        await db.none(`INSERT INTO public.company (company_name)
                       VALUES ($1);`, [pd.company_name]);
        res.status(200).json("Успешно");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.addStudentsGroup = async function (req, res) {
    const { payload: pd } = req.body;
    try {
        await db.none(`INSERT INTO public.students_group 
                       (cafedra_id, students_group_type_id, students_group_name, students_group_count)
                       VALUES ($1, $2, $3, $4);`, [pd.cafedra_id, pd.students_group_type_id, pd.students_group_name, pd.students_group_count]);
        res.status(200).json("Успешно");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}

module.exports.addDiscipline = async function (req, res) {
    const { payload } = req.body;
    try {
        await db.none(`INSERT INTO public.discipline (cafedra_id, discipline_name)
                       VALUES ($1, $2);`, [payload.cafedra_id, payload.discipline_name]);
        res.status(200).json("Успешно");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
}



