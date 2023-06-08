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
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = jwt.sign({ userId: user.users_id }, process.env.JWT_SECRET, { expiresIn: '1d' }, { algorithm: 'HS256' });

        const data = await db.one(`SELECT sd.users_id, role_name, u.users_first_name as first_name, u.users_last_name as last_name, users_email,
            ds.cafedra_id, cf.cafedra_name
            from students_discipline as sd join users as u
            on sd.users_id = u.users_id join role on u.role_id = role.role_id
            join discipline as ds on sd.discipline_id = ds.discipline_id 
            join cafedra as cf on ds.cafedra_id = cf.cafedra_id where sd.users_id = ${user.users_id} limit 1;`,)
        res.status(200).json({
            users_id: data.users_id,
            cafedra_id: data.cafedra_id,
            cafedra_name: data.cafedra_name,
            first_name: data.first_name,
            last_name: data.last_name,
            users_email: data.users_email,
            token: token,
            role_name: data.role_name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
};
