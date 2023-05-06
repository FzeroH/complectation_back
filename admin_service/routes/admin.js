const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const controller = require('../controllers/adminController')
const { authenticateToken } = require('../middleware/authenticateToken')

router.get('/get_users', authenticateToken , controller.getUsers)

router.post('/update_user', authenticateToken, controller.updateUser);


module.exports = router