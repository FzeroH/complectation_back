const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/user', controller.getUserById);


module.exports = router
