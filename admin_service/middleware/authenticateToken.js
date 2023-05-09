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
                // Проверяем, нужно ли обновить токен
                const nowSeconds = Math.floor(Date.now() / 1000);
                if (nowSeconds >= decoded.exp - 60) {
                    const newToken = jwt.sign({userId: decoded.userId}, process.env.JWT_SECRET, {expiresIn: '1h'}); // создаем новый токен со сроком действия 15 минут
                    res.set('Authorization', `Bearer ${newToken}`);
                    // Здесь можно сохранить новый токен в куки, например:
                    // res.cookie('token', newToken, { maxAge: 900000, httpOnly: true, secure: true });
                }
                next();
            }
        } catch (err) {
            return res.status(401).send('Invalid JWT token');
        }
    } else {
        return res.status(401).send('JWT не найден!')
    }
}
