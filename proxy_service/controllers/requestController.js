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
        const requestId = req.body.id;
        const newStatus = req.body.status;
        const response = await proxy_main.put(`/api/change_status?id=${requestId}&status=${newStatus}`);
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
    try {
        const orderData = req.body;
        const response = await proxy_main.post('/api/create_order', orderData);
        const createdOrder = response.data;
        createdOrder.users_id = req.session.user.users_id
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getRequests = async function (req, res) {
    const { value: val, title: name } = req.query;
    const value = val || '';
    const title = name || '';

    try {
        const response = await proxy_main.get(`/api/all_requests?value=${value}&title=${title}`);
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

