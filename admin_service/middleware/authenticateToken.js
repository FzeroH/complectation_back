const jwt = require("jsonwebtoken");

module.exports.authenticateToken = async function (req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('JWT token is missing');
    }
    try {
        const decoded = jwt.verify(token, 'secret_key');
        if (decoded.role !== 'administartor') {
            return res.status(401).send('Access denied. User is not an administrator');
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Invalid JWT token');
    }
}