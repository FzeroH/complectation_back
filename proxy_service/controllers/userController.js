const { proxy_main } = require('../config/axios.config');

module.exports.getUserById = async function (req, res) {
    try {
        const id = req.session
        console.log(id)
        // const response = await proxy_main.get(`/api/user/?id=${id}`);
        // const user = response.data;
        // res.status(200).json(user);
        console.log(id)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}
