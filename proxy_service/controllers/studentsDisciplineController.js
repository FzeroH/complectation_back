const { proxy_main } = require('../config/axios.config');

module.exports.getDiscipline = async function (req, res) {
    const { users_id } = req.session.user
    try {
        const response = await proxy_main.get(`/api/discipline/?users_id=${users_id}`);
        const discipline = response.data;
        res.status(200).json(discipline);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getStudentGroupsByDiscipline = async function (req, res) {
    const { users_id } = req.session.user
    try {
        const disciplineId = req.query.id;
        console.log(disciplineId)
        const response = await proxy_main.get(`/api/student_group/?id=${disciplineId}&users_id=${users_id}`);
        const studentGroups = response.data;
        res.status(200).json(studentGroups);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getGroupInfo = async function (req, res) {
    const { users_id } = req.session.user
    try {
        const { discipline_id,student_group_id } = req.query;
        const response = await proxy_main.get(`/api/group_info?discipline_id=${discipline_id}&student_group_id=${student_group_id}&users_id=${users_id}`);
        const groupInfo = response.data;
        res.status(200).json(groupInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

