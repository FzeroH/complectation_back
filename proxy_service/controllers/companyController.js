const { proxy_main } = require('../config/axios.config');

module.exports.getCompanyName = async function (req, res) {
    try {
        const result = await proxy_main.get('/api/companies');
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}
