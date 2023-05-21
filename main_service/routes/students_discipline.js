const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentsDisciplineController');

const { authenticateToken } = require('../middleware/authenticateToken');

router.get('/discipline', controller.getDiscipline);
router.get('/student_group', controller.getStudentGroupsByDiscipline);
router.get('/group_info', controller.getGroupInfo);


module.exports = router
