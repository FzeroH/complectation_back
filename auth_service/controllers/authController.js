const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../configs/postgresConfig');


module.exports.login = async function (req, res){
    const { email, password } = req.body;

    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE user_email = ${email}', { email: email });

        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
};

module.exports.registration =  async function (req, res) {
    const { user_first_name, user_last_name, user_email, user_password } = req.body;
    try {

        const candidate = await db.oneOrNone('SELECT user_id FROM users WHERE user_email = ${email}', {
            email: user_email
        });

        if (candidate) {
            return res.status(400).json({ error: 'Пользователь уже зарегистрирован' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.one(
            'INSERT INTO users (user_first_name, user_last_name, user_email, user_password) VALUES (${first_name}, ${last_name}, ${email},${password})',
            {
                first_name: user_first_name,
                last_name: user_last_name,
                email: user_email,
                password: hashedPassword
            });


        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: newUser.id, email: newUser.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
};

module.exports.getUserData = async function (req, res){
    const request = req.body
    await db.query('SELECT * FROM user WHERE user_id = ${ user_id }', {
        user_id:request.user_id
    })
};
