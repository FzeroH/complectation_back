const express = require('express');
const router = express.Router();
const controller = require('../controllers/documentController');

router.post('/download', controller.generateDocument)

module.exports = router
