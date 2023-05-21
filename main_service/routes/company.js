const express = require('express');
const router = express.Router();
const controller = require('../controllers/companyController');

const { authenticateToken } = require('../middleware/authenticateToken');

router.get('/companies', controller.getCompanyName);


module.exports = router
