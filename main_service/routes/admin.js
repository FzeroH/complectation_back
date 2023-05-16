const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { authenticateAdmin } = require('../middleware/authenticateAdmin');

router.get('/get_users',authenticateToken, authenticateAdmin, controller.getUsers);

router.post('/update_user',authenticateToken, authenticateAdmin, controller.updateUser);

router.post('/registration',authenticateToken, authenticateAdmin, controller.registration);

//======= Добавление данных в таблицы =======
router.post('/add_group_type',authenticateToken, authenticateAdmin, controller.addStudentsGroupType);

router.post('/add_students_group',authenticateToken, authenticateAdmin, controller.addStudentsGroup);

router.post('/add_students_discipline',authenticateToken, authenticateAdmin, controller.addStudentsDiscipline);

router.post('/add_role',authenticateToken, authenticateAdmin, controller.addRole);

router.post('/add_request_status',authenticateToken, authenticateAdmin, controller.addRequestStatus);

router.post('/add_pub_type',authenticateToken, authenticateAdmin, controller.addPublicationType);

router.post('/add_faculty',authenticateToken, authenticateAdmin, controller.addFaculty);

router.post('/add_discipline',authenticateToken, authenticateAdmin, controller.addDiscipline);

router.post('/add_cafedra',authenticateToken, authenticateAdmin, controller.addCafedra);

router.post('/add_company',authenticateToken, authenticateAdmin, controller.addCompany);

//======= Обновление данных в таблицах =======
router.post('/update_group_type',authenticateToken, authenticateAdmin, controller.updateStudentsGroupType);

router.post('/update_students_group',authenticateToken, authenticateAdmin, controller.updateStudentsGroup);

router.post('/update_students_discipline',authenticateToken, authenticateAdmin, controller.updateStudentsDiscipline);

router.post('/update_role',authenticateToken, authenticateAdmin, controller.updateRole);

router.post('/update_request_status',authenticateToken, authenticateAdmin, controller.updateRequestStatus);

router.post('/update_pub_type',authenticateToken, authenticateAdmin, controller.updatePublicationType);

router.post('/update_faculty',authenticateToken, authenticateAdmin, controller.updateFaculty);

router.post('/update_discipline',authenticateToken, authenticateAdmin, controller.updateDiscipline);

router.post('/update_cafedra',authenticateToken, authenticateAdmin, controller.updateCafedra);

router.post('/update_company',authenticateToken, authenticateAdmin, controller.updateCompany);

module.exports = router