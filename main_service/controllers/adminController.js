const { db } = require('../configs/postgresConfig');

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
