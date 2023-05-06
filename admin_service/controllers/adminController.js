const { db } = require('../configs/postgresConfig');

module.exports.updateUser =  async function (req, res) {
    const { user_role } = req.body;

};

module.exports.getUsers = async function (req, res){
    try {
        // Получаем список пользователей из базы данных
        const users = await db.query('SELECT users_id, users_first_name, users_last_name, users_email FROM users');
        // Отправляем список пользователей в ответ на запрос
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
