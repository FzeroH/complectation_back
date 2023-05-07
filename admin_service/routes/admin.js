const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController')
const { authenticateAdminToken } = require('../middleware/authenticateToken')

router.get('/get_users', authenticateAdminToken , controller.getUsers)

router.post('/update_user', authenticateAdminToken, controller.updateUser);


module.exports = router