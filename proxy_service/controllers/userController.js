const { proxy_main } = require('../config/axios.config');

module.exports.getUserById = async function (req, res) {
    try {
        const id = req.user.userId;
        const response = await proxy_main.get(`/api/user/?id=${id}`);
        const user = response.data;
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getDepartmentName = async function (req, res) {
    try {
        const userId = req.params.userId;
        const response = await proxy_main.get(`/api/user/department/${userId}`);
        const department = response.data;
        res.status(200).json(department);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

