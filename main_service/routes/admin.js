const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { authenticateAdmin } = require('../middleware/authenticateAdmin');

router.get('/get_users',authenticateToken, authenticateAdmin, controller.getUsers);

router.post('/update_user',authenticateToken, authenticateAdmin, controller.updateUser);

router.post('/registration',authenticateToken, authenticateAdmin, controller.registration);

//======= Добавление данных в таблицы =======
router.post('/add_group_type',authenticateToken, authenticateAdmin, controller.addGroupType);

router.post('/add_students_group',authenticateToken, authenticateAdmin, controller.addStudentsGroup);

router.post('/add_students_discipline',authenticateToken, authenticateAdmin, controller.addStudentsDiscipline);

router.post('/add_role',authenticateToken, authenticateAdmin, controller.addRole);

router.post('/add_request_status',authenticateToken, authenticateAdmin, controller.addRequestStatus);

router.post('/add_pub_type',authenticateToken, authenticateAdmin, controller.addPublicationType);

router.post('/add_faculty',authenticateToken, authenticateAdmin, controller.addFaculty);

router.post('/add_discipline',authenticateToken, authenticateAdmin, controller.addDiscipline);

router.post('/add_cafedra',authenticateToken, authenticateAdmin, controller.addCafedra);

router.post('/add_company',authenticateToken, authenticateAdmin, controller.addCompany);

module.exports = router