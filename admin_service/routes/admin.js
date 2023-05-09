const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController')
const { authenticateToken } = require('../middleware/authenticateToken')
const { authenticateAdmin } = require('../middleware/authenticateAdmin')

router.get('/get_users', authenticateToken ,authenticateAdmin, controller.getUsers)

router.post('/update_user', authenticateToken, authenticateAdmin, controller.updateUser);


module.exports = router