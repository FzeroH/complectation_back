const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../configs/postgresConfig');


module.exports.login = async function (req, res){
    const { users_email, users_password } = req.body;

    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE user_email = ${email}', { email: users_email });

        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const passwordMatch = await bcrypt.compare(users_password, user.users_password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = jwt.sign({ userId: user.users_id, userRole: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.users_id, email: user.users_email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
};

module.exports.registration =  async function (req, res) {
    const { users_first_name, users_last_name, users_email, users_password } = req.body;
    try {

        const candidate = await db.oneOrNone('SELECT users_id FROM users WHERE users_email = ${ email }', {
            users_email: users_email,
        });

        if (candidate) {
            return res.status(400).json({ error: 'Пользователь уже зарегистрирован' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.one(
            'INSERT INTO users (user_first_name, user_last_name, user_email, user_password) VALUES (${first_name}, ${last_name}, ${email},${password})',
            {
                first_name: users_first_name,
                last_name: users_last_name,
                email: users_email,
                password: hashedPassword
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
};

module.exports.getUserData = async function (req, res){
    const request = req.body
    const result = await db.one('SELECT * FROM user WHERE user_id = ${ user_id }', {
        user_id:request.user_id
    })
    return res.status(200).json({
        users_id: result.users_id,
        users_first_name: result.users_id,
        users_last_name: result.users_id,
        users_role: result.users_role,
    })
};
