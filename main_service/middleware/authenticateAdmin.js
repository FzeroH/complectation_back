const { db } = require('../configs/postgresConfig');

module.exports.authenticateAdmin = async function (req, res, next) {
    const { userId } = req.user;
    console.log(userId);

    if (userId) {
        try {
            const { role_id } = await db.one(`SELECT role_id FROM users WHERE users_id = ${userId}`, {userId});
            console.log(role_id);
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка сервера');
        }
    } else {
        res.status(401).send('Недействительный токен');
    }
}

