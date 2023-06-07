const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../configs/postgresConfig');


module.exports.login = async function (req, res){
    const { users_email, users_password } = req.body;
    try {
        const user = await db.oneOrNone(`SELECT users_id, users_first_name as first_name, 
                users_last_name as last_name, users_email, users_password, role_name
                FROM users JOIN role ON users.role_id = role.role_id WHERE users_email = $1`, [users_email]);
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const passwordMatch = await bcrypt.compare(users_password, user.users_password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Неверный email или пароль(точно пароль)' });
        }

        const token = jwt.sign({ userId: user.users_id }, process.env.JWT_SECRET, { expiresIn: '1d' }, { algorithm: 'HS256' });
        res.status(200).json({
            users_id: user.users_id,
            first_name: user.first_name,
            last_name: user.last_name,
            users_email: user.users_email,
            token: token,
            role_name: user.role_name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
};
