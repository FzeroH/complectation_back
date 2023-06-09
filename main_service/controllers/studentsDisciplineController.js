const { db } = require("../configs/postgresConfig");

module.exports.getDiscipline = async function (req,res) {
    const {users_id} = req.query;
    try {
        const result = await db.many(`
        SELECT sd.discipline_id as value, discipline_name as title
        FROM students_discipline as sd 
        join discipline as ds on sd.discipline_id = ds.discipline_id
        where users_id = $1
        GROUP BY sd.discipline_id, ds.discipline_name
        `, [+users_id])
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};

module.exports.getStudentGroupsByDiscipline = async function (req,res) {
    const { id, users_id } = req.query
    try {
        const result = await db.query(`
            SELECT sd.students_group_id as value, students_group_name as title
            FROM students_discipline as sd join students_group as sg on sd.students_group_id = sg.students_group_id
            join students_group_type as sgt on sg.students_group_type_id = sgt.students_group_type_id where sd.discipline_id = $1 and users_id = $2
        `, [+id, +users_id])
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};

module.exports.getGroupInfo = async function (req,res) {
    const { discipline_id,student_group_id, users_id } = req.query
    try {
        const result = await db.one(`
            SELECT ceil(students_group_count / 4) as request_count,
                   students_group_count,
                   students_discipline_semester,
                   students_group_name,
                   students_group_type_name as students_group_type
            FROM public.students_discipline as sd
                     join students_group as sg on sd.students_group_id = sg.students_group_id
                     join students_group_type as sgt on sg.students_group_type_id = sgt.students_group_type_id
            where sd.students_group_id = $2
              and sd.discipline_id = $1 and users_id = $3; 
        `, [discipline_id, student_group_id, users_id])// TODO: Изменить запрос, чтобы происходила группировка данных о группе.
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};
