const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');

const { authenticateToken } = require('../middleware/authenticateToken');

router.get('/publicaions', controller.getPublications);
router.post('/create_request', controller.createRequest);
router.post('/collete_request', controller.colleteRequest);

module.exports = router