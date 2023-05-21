const { db } = require("../configs/postgresConfig");

module.exports.getDiscipline = async function (req,res) {
    try {
        const result = await db.many(`
        SELECT sd.discipline_id, discipline_name 
        FROM students_discipline as sd join discipline as ds on sd.discipline_id = ds.discipline_id
        `)
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};

module.exports.getStudentGroupsByDiscipline = async function (req,res) {
    const { id } = req.query
    try {
        const result = await db.one(`
            SELECT sd.students_group_id, students_group_name
            FROM students_discipline as sd join students_group as sg on sd.students_group_id = sg.students_group_id
            join students_group_type as sgt on sg.students_group_type_id = sgt.students_group_type_id where sd.discipline_id = $1
        `, [id])
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};

module.exports.getGroupInfo = async function (req,res) {
    const { discipline_id,students_group_id } = req.query
    try {
        const result = await db.one(`
            SELECT students_discipline_semester, students_group_type_name, students_group_count
            FROM students_discipline as sd
            join students_group as sg on sd.students_group_id = sg.students_group_id
            join students_group_type as sgt on sg.students_group_type_id = sgt.students_group_type_id
            where sd.discipline_id = $1 and sd.students_group_id = $2
        `, [discipline_id, students_group_id])
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};
