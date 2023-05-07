const jwt = require("jsonwebtoken");

module.exports.authenticateToken = async function (req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('JWT токен не найден');
    }
    try {
        const decoded = jwt.verify(token, 'secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Invalid JWT token');
    }
}