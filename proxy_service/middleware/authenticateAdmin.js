const { db } = require('../../main_service/configs/postgresConfig');

module.exports.authenticateAdmin = async function (req, res, next) {
    const { userId } = req.user;
    await db.one('SELECT users_id, users.role_id FROM users JOIN role ON users.role_id = role.role_id WHERE users_id = $1',[userId])
        .then(res => {
            if (res.role_id === 1){
                next()
            } else {
                res.status(403).send('У вас нет прав для использования этой функции!')
            }
        }).catch(e => {
            res.status(403).send('У вас нет прав для использования этой функции!')
        });
}
