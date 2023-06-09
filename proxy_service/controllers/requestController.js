const { proxy_main } = require('../config/axios.config');

module.exports.createRequest = async function (req, res) {
    try {
        const requestData = req.body;
        requestData.cafedra_id = req.session.user.cafedra_id
        requestData.users_id = req.session.user.users_id
        const response = await proxy_main.post('/api/create_request', requestData);
        const createdRequest = response.data;
        res.status(201).json(createdRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.changeRequestStatus = async function (req, res) {
    try {
        console.log(req.body)
        const {id, status} = req.body;
        const response = await proxy_main.put(`/api/change_status`, {id, status});
        const updatedRequest = response.data;
        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.createOrder = async function (req, res) {
    const {order_ids, total_price} = req.body
    try {
        const data = {
            users_id: req.session.user.users_id,
            order_ids,
            total_price
        }
        console.log(data);
        const response = await proxy_main.post('/api/create_order', data);
        res.status(201).json({
            message: 'Успешно'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getRequests = async function (req, res) {
    const { value: val, status: stat } = req.query;
    const value = val || '';
    const status = stat || '';
    console.log(status);

    try {
        const response = await proxy_main.get(`/api/all_requests?value=${value}&status=${status}`);
        const requests = response.data;
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getRequestsByUserId = async function (req, res) {
    try {
        const userId = req.session.user.users_id;
        const response = await proxy_main.get(`/api/requests?id=${userId}`);
        const requests = response.data;
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

