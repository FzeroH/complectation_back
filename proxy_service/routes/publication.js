const express = require('express');
const router = express.Router();
const controller = require('../controllers/publicationController');

router.get('/publications', controller.getPublications);

router.get('/publication', controller.getPublicationById);

router.get('/pub_types', controller.getPublicationType);

module.exports = router
