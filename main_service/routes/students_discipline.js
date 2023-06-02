const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentsDisciplineController');

router.get('/discipline', controller.getDiscipline);
router.get('/student_group', controller.getStudentGroupsByDiscipline);
router.get('/group_info', controller.getGroupInfo);


module.exports = router
