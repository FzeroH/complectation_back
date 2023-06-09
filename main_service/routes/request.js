const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');

router.post('/create_request', controller.createRequest);

router.put('/change_status', controller.changeRequestStatus);

router.post('/create_order', controller.createOrder);

router.get('/all_requests', controller.getRequests);

router.get('/requests', controller.getRequestsByUserId);

module.exports = router
