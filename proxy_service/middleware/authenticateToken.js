const jwt = require('jsonwebtoken');

module.exports.authenticateToken = async function (req, res, next) {
    if (req.headers['authorization']) {
        try {
            let token = req.headers['authorization'].split(' ');
            if (token[0] !== 'Bearer') {
                return res.status(401).send('Not Bearer');
            } else {
                const decoded = jwt.verify(token[1], process.env.JWT_SECRET, { algorithm: 'HS256' });
                req.user = decoded;
                next();
            }
        } catch (err) {
            return res.status(401).send('Invalid JWT token');
        }
    } else {
        return res.status(401).send('JWT не найден!')
    }
}
