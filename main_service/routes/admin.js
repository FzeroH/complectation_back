const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { authenticateAdmin } = require('../middleware/authenticateAdmin');

router.get('/table-list', controller.getTables);

router.get('/table-columns', controller.getColumns);

router.get('/users', controller.getUsers);

// router.put('/users',authenticateToken, authenticateAdmin, controller.updateUser);

router.post('/users', controller.registration);

router.get('/students_discipline', controller.getStudentsDiscipline)

// router.put('/students_discipline', controller.changeStudentsDiscipline)

// router.post('/students_discipline', controller.addStudentsDiscipline)

router.get('/company', controller.getCompany)

router.get('/students_group', controller.getStudentsGroup)

router.get('/discipline', controller.getDiscipline)

module.exports = router
