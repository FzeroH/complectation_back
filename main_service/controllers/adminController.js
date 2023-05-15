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

// Функции просмотра списков
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