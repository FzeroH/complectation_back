const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../configs/postgresConfig');


module.exports.login = async function (req, res){
    const { users_email, users_password } = req.body;

    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE users_email = $1', [users_email]);

        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const passwordMatch = await bcrypt.compare(users_password, user.users_password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Неверный email или пароль(точно пароль)' });
        }

        const token = jwt.sign({ userId: user.users_id }, process.env.JWT_SECRET, { expiresIn: '1d' }, { algorithm: 'HS256' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
};
