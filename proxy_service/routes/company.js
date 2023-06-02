const express = require('express');
const router = express.Router();
const controller = require('../controllers/companyController');

router.get('/companies', controller.getCompanyName);


module.exports = router
