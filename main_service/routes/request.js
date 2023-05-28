const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');

const { authenticateToken } = require('../middleware/authenticateToken');

router.post('/create_request', controller.createRequest);

router.put('/change_status', controller.changeRequestStatus);

router.post('/create_order', controller.createOrder);

router.get('/requests', controller.getRequests);

router.get('/requests_by_id', controller.getRequestsByUserId);

router.get('/get_filtered_request', controller.getFilteredRequest);

module.exports = router

//TODO: Сделать функцию получения списка всех заказов
