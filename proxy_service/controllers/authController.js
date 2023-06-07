const { proxy_main } = require('../config/axios.config');

module.exports.login = async function (req, res) {
    try {
        const { body } = req;
        const result = await proxy_main.post('/api/auth/login', body);
        req.session.users_id = result.data.users_id
        console.log(req.session.users_id)
        res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
}
