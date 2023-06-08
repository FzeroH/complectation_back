const { proxy_main } = require('../config/axios.config');

module.exports.getUserById = async function (req, res) {
    try {
        const id = req.session.user.users_id
        const response = await proxy_main.get(`/api/user/?id=${id}`);
        const user = response.data;
        console.log(user)
        req.session.user.cafedra_id = user.cafedra_id
        console.log(req.session.user)
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}
