const { proxy_main } = require('../config/axios.config');

module.exports.login = async function (req, res, next) {
    try {
        const { body } = req;
        const result = await proxy_main.post('/api/auth/login', body);
        req.session.user = {
            users_id: result.data.users_id,
            cafedra_id: result.data.cafedra_id,
            cafedra_name: result.data.cafedra_name
        }
            res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
}
