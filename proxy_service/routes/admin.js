const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');

router.get('/table-list', controller.getTables);
router.get('/table-columns', controller.getColumns);

router.get('/users', controller.getUsers);
router.post('/users', controller.addUser);
router.put('/users', controller.changeUser);

router.get('/students_discipline', controller.getStudentsDiscipline);
router.post('/students_discipline', controller.addStudentsDiscipline);
router.put('/students_discipline', controller.changeStudentsDiscipline);

router.get('/company', controller.getCompany);
router.post('/company', controller.addCompany);
router.put('/company', controller.changeCompany);

router.get('/students_group', controller.getStudentsGroup);
router.post('/students_group', controller.addStudentsGroup);
router.put('/students_group', controller.changeStudentsGroup);

router.get('/discipline', controller.getDiscipline);
router.post('/discipline', controller.addDiscipline);
router.put('/discipline', controller.changeDiscipline);

module.exports = router
