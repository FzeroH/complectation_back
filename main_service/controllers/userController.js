const { db } = require("../configs/postgresConfig");

module.exports.getUserById = async function (req,res) {
    const { id } = req.query
    try {
        const result = await db.one(`
            SELECT users_id, users.role_id, users_first_name, users_last_name, users_email FROM users 
            JOIN role ON users.role_id = role.role_id WHERE users_id = $1;
        `,[id])

        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};

module.exports.getDepartmentName = async function (req ,res){
    const { id } = req.query
        try {
        const result = await db.one(`
        SELECT u.users_first_name, u.users_last_name, ds.cafedra_id, cf.cafedra_name 
        from students_discipline as sd join users as u
        on sd.users_id = u.users_id join discipline as ds on
        sd.discipline_id = ds.discipline_id join cafedra as cf
        on ds.cafedra_id = cf.cafedra_id where sd.users_id = $1;
        `,[id])

        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
}; //Получить информацию о кафедре по преподавателю


