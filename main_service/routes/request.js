const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');

const { authenticateToken } = require('../middleware/authenticateToken');

router.post('/create_request', controller.createRequest);

router.put('/update_status', controller.updateRequestStatus);

router.post('/create_finaly_request', controller.createFinalyRequest);

router.get('/get_requests', controller.getRequests);

router.get('/get_requests', controller.getRequestsByUserId);

router.get('/get_filtered_request', controller.getFilteredRequest);

module.exports = router
