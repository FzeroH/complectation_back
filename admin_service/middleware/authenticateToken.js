const jwt = require("jsonwebtoken");

module.exports.authenticateAdminToken = async function (req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('JWT токен не найден');
    }
    try {
        const decoded = jwt.verify(token, 'secret_key');
        //TODO:Подумать о том, как лучше осуществлять проверку роли пользователя
        if (decoded.role_id !== 'administartor') {
            return res.status(401).send('Доступ запрещен. Пользователь не является администратором');
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Invalid JWT token');
    }
}