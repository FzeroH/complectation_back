const bcrypt = require('bcryptjs')
const { db } = require('../configs/postgresConfig');


module.exports.login = async function (req, res){
    const request = req.body
    await db.query()
};

module.exports.registration =  async function (req, res) {
    const request = req.body
    const candidate = await db.query(`SELECT email FROM user WHERE user_email = ${ email }`,{
        email: request.email
    })
    if(candidate){
        res.status(404).json({
            message:'Пользователь с таким e-mail уже существует'
        })
    } else {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(request.password, salt, function (err, hash) {
                db.query(`INSERT INTO user (first_name, last_name, email, password))
                          VALUES (${first_name}, ${last_name}, ${email}, ${password})`,
                    {
                        first_name: request.first_name,
                        last_name: request.last_name,
                        email: request.email,
                        password: hash
                    })
                    .then(() => {
                        res.status(200).json({
                            message: 'Успешно'
                        })
                    })
                    .catch(e => {
                        res.status(401).json({
                            message: e.message
                        })
                    })
                console.log(hash);
            });
        });
    }
};

module.exports.getUserData = async function (req, res){
    const request = req.body
    await db.query('SELECT * FROM user WHERE user_id = ${ user_id }', {
        user_id:request.user_id
    })
};
