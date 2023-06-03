const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const {authenticateToken} = require('../middleware/authenticateToken')

router.get('/user', authenticateToken, controller.getUserById);

router.get('/department', controller.getDepartmentName);


module.exports = router
