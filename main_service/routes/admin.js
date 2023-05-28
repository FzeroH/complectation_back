const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { authenticateAdmin } = require('../middleware/authenticateAdmin');

router.get('/users',authenticateToken, authenticateAdmin, controller.getUsers);

router.put('/users',authenticateToken, authenticateAdmin, controller.updateUser);

router.post('/users',authenticateToken, authenticateAdmin, controller.registration);

//======= Добавление данных в таблицы =======
router.post('/group_type',authenticateToken, authenticateAdmin, controller.addStudentsGroupType);

router.post('/students_group',authenticateToken, authenticateAdmin, controller.addStudentsGroup);

router.post('/students_discipline',authenticateToken, authenticateAdmin, controller.addStudentsDiscipline);

router.post('/role',authenticateToken, authenticateAdmin, controller.addRole);

router.post('/request_status',authenticateToken, authenticateAdmin, controller.addRequestStatus);

router.post('/publication_type',authenticateToken, authenticateAdmin, controller.addPublicationType);

router.post('/faculty',authenticateToken, authenticateAdmin, controller.addFaculty);

router.post('/discipline',authenticateToken, authenticateAdmin, controller.addDiscipline);

router.post('/cafedra',authenticateToken, authenticateAdmin, controller.addCafedra);

router.post('/company',authenticateToken, authenticateAdmin, controller.addCompany);

//======= Обновление данных в таблицах =======
router.put('/group_type',authenticateToken, authenticateAdmin, controller.updateStudentsGroupType);

router.put('/students_group',authenticateToken, authenticateAdmin, controller.updateStudentsGroup);

router.put('/students_discipline',authenticateToken, authenticateAdmin, controller.updateStudentsDiscipline);

router.put('/role',authenticateToken, authenticateAdmin, controller.updateRole);

router.put('/request_status',authenticateToken, authenticateAdmin, controller.updateRequestStatus);

router.put('/publication_type',authenticateToken, authenticateAdmin, controller.updatePublicationType);

router.put('/faculty',authenticateToken, authenticateAdmin, controller.updateFaculty);

router.put('/discipline',authenticateToken, authenticateAdmin, controller.updateDiscipline);

router.put('/cafedra',authenticateToken, authenticateAdmin, controller.updateCafedra);

router.put('/company',authenticateToken, authenticateAdmin, controller.updateCompany);

module.exports = router
