const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');

const { authenticateToken } = require('../middleware/authenticateToken');

router.post('/create_request', controller.createRequest);

router.put('/update_status', controller.updateRequestStatus);

module.exports = router
