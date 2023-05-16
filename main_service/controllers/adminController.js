const { db } = require('../configs/postgresConfig');
const bcrypt = require("bcryptjs");

//TODO: добавить функции на заполнение всех таблиц и настройку связей между ними

module.exports.updateUser =  async function (req, res) {
    const { role_id, user_id } = req.body;
    try {
        await db.none('UPDATE users SET role_id = $1 WHERE users_id = $2', [role_id, user_id])
        res.status(200).json({
            message: "Роль пользователя успешно изменена"
        })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};


module.exports.getUsers = async function (req, res){
    try {
        // Получаем список пользователей из базы данных
        const users = await db.query('SELECT users_id, users_first_name, users_last_name, users_email, role_name FROM users JOIN role ON users.role_id = role.role_id');
        // Отправляем список пользователей в ответ на запрос
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка'
        });
    }
};

// Функции добавления данных
module.exports.registration =  async function (req, res) {
    const { users_first_name, users_last_name, users_email, users_password } = req.body;
    console.log(req.body);
    try {
        const candidate = await db.oneOrNone('SELECT users_id FROM users WHERE users_email = $1', [users_email]);

        if (candidate) {
            return res.status(400).json({ error: 'Пользователь уже зарегистрирован' });
        }

        const hashedPassword = await bcrypt.hash(users_password, 10);

        const newUser = await db.none(
            'INSERT INTO users (users_first_name, users_last_name, users_email, users_password, role_id) VALUES ($1, $2, $3, $4, $5)',
            [users_first_name, users_last_name, users_email, hashedPassword, process.env.DEFAULT_ROLE]
        );
        res.status(200).json({
            message:"Успешно"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
};

module.exports.addGroupType = async function (req, res) {
    const { students_group_type_name } = req.body;
    try {
        await db.none('INSERT INTO students_group_type (students_group_type_name) VALUES ($1)',
            [students_group_type_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
};

module.exports.addStudentsGroup = async function (req, res){
    const { cafedra_id, students_group_type_id, students_group_name, students_group_count } = req.body;
    try {
        await db.none('INSERT INTO students_group (cafedra_id, students_group_type_id, students_group_name, students_group_count) VALUES ($1, $2, $3, $4)',
            [cafedra_id, students_group_type_id, students_group_name, students_group_count]);
        res.status(200).json({
            message: 'Успешно'
        })
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        })
    }
}

module.exports.addStudentsDiscipline = async function (req, res){
    const { discipline_id, students_group_id, users_id } = req.body;
    try {
        db.none('INSERT INTO students_discipline (discipline_id, students_group_id, users_id) VALUES ($1, $2, $3)',
            [discipline_id, students_group_id, users_id]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.addRole = async function (req, res){
    const { role_name } = req.body;
    try {
        db.none('INSERT INTO role (role_name) VALUES ($1)',
            [role_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.addRequestStatus = async function (req, res){
    const { request_status_name } = req.body;
    try {
        await db.none('INSERT INTO request_status (request_status_name) VALUES ($1)',
            [request_status_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.addPublicationType = async function (req, res){
    const { pub_type_name } = req.body;
    try {
        await db.none('INSERT INTO publication_type (pub_type_name) VALUES ($1)',
            [pub_type_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.addFaculty = async function (req, res){
    const { faculty_name } = req.body;
    try {
        await db.none('INSERT INTO faculty (pub_type_name) VALUES ($1)',
            [faculty_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.addDiscipline = async function (req, res){
    const { cafedra_id, discipline_name } = req.body;
    try {
        await db.none('INSERT INTO discipline (cafedra_id, discipline_name) VALUES ($1, $2)',
            [cafedra_id, discipline_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.addCafedra = async function (req, res){
    const { faculty_id, cafedra_name } = req.body;
    try {
        await db.none('INSERT INTO cafedra (faculty_id, cafedra_name) VALUES ($1, $2)',
            [faculty_id, cafedra_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.addCompany = async function (req, res){
    const { company_name } = req.body;
    try {
        await db.none('INSERT INTO cafedra (company_name) VALUES ($1)',
            [company_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}
//Следующая таблица - факультеты...
// Функции удаления