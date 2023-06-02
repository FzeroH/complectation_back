const { proxy_main } = require('../config/axios.config');

module.exports.login = async function (req, res) {
    try {
        const { body } = req;
        const result = await proxy_main.post('/api/auth/login', body);
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}
