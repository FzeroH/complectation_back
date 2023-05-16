const { db } = require('../configs/postgresConfig');
const bcrypt = require("bcryptjs");

//TODO: добавить функции на заполнение всех таблиц и настройку связей между ними

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

        await db.none(
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

module.exports.addStudentsGroupType = async function (req, res) {
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
        await db.none('INSERT INTO students_discipline (discipline_id, students_group_id, users_id) VALUES ($1, $2, $3)',
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
        await db.none('INSERT INTO role (role_name) VALUES ($1)',
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
        await db.none('INSERT INTO faculty (faculty_name) VALUES ($1)',
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
        await db.none('INSERT INTO company (company_name) VALUES ($1)',
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

// Функции обновления
module.exports.updateUser = async function (req, res) {
    const { users_id, users_first_name, users_last_name, users_email } = req.body;
    try {
        await db.none('UPDATE users SET users_first_name = $2, users_last_name = $3, users_email = $4 WHERE users_id = $1',
            [users_id, users_first_name, users_last_name, users_email]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updateStudentsGroupType = async function (req, res) {
    const { students_group_type_id, students_group_type_name } = req.body;
    try {
        await db.none('UPDATE students_group_type SET students_group_type_name = $2 WHERE students_group_type_id = $1',
            [students_group_type_id, students_group_type_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updateStudentsGroup = async function (req, res) {
    const { students_group_id, cafedra_id, students_group_type_id, students_group_name, students_group_count } = req.body;
    try {
        await db.none('UPDATE students_group SET cafedra_id = $2, students_group_type_id = $3, students_group_name = $4, students_group_count = $5 WHERE students_group_id = $1',
            [students_group_id, cafedra_id, students_group_type_id, students_group_name, students_group_count]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updateStudentsDiscipline = async function (req, res) {
    const { students_discipline_id, discipline_id, students_group_id, users_id } = req.body;
    try {
        await db.none('UPDATE students_discipline SET discipline_id = $2, students_group_id = $3, users_id = $4 WHERE students_discipline_id = $1',
            [students_discipline_id, discipline_id, students_group_id, users_id]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updateRole = async function (req, res) {
    const { role_id, role_name } = req.body;
    try {
        await db.none('UPDATE role SET role_name = $2 WHERE role_id = $1',
            [role_id, role_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updateRequestStatus = async function (req, res) {
    const { request_status_id, request_status_name } = req.body;
    try {
        await db.none('UPDATE request_status SET request_status_name = $2 WHERE request_status_id = $1',
            [request_status_id, request_status_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updatePublicationType = async function (req, res) {
    const { pub_type_id, pub_type_name } = req.body;
    try {
        await db.none('UPDATE publication_type SET pub_type_name = $2 WHERE pub_type_id = $1',
            [pub_type_id, pub_type_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updatePublication = async function (req, res) {
    const { publication_id, company_id, publication_author, publication_title, publication_year, publication_cost } = req.body;
    try {
        await db.none('UPDATE publication SET company_id = $2, publication_author = $3, publication_title = $4, publication_year = $5, publication_cost = $6 WHERE publication_id = $1',
            [publication_id, company_id, publication_author, publication_title, publication_year, publication_cost]);
        res.status(200
        ).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updateFaculty = async function (req, res) {
    const { faculty_id, faculty_name } = req.body;
    try {
        await db.none('UPDATE faculty SET faculty_name = $2 WHERE faculty_id = $1',
            [faculty_id, faculty_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updateDiscipline = async function (req, res) {
    const { discipline_id, cafedra_id, discipline_name } = req.body;
    try {
        await db.none('UPDATE discipline SET cafedra_id = $2, discipline_name = $3 WHERE discipline_id = $1',
            [discipline_id, cafedra_id, discipline_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updateCafedra = async function (req, res) {
    const { cafedra_id, faculty_id, cafedra_name } = req.body;
    try {
        await db.none('UPDATE cafedra SET faculty_id = $2, cafedra_name = $3 WHERE cafedra_id = $1',
            [cafedra_id, faculty_id, cafedra_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

module.exports.updateCompany = async function (req, res) {
    const { company_id, company_name } = req.body;
    try {
        await db.none('UPDATE company SET company_name = $2 WHERE company_id = $1',
            [company_id, company_name]);
        res.status(200).json({
            message: 'Успешно'
        });
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка'
        });
    }
}

