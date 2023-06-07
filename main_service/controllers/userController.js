const { db } = require("../configs/postgresConfig");

module.exports.getUserById = async function (req,res) {
    const { id } = req.query
    try {
        const result = await db.one(`
            SELECT sd.users_id, role_name, u.users_first_name as first_name, u.users_last_name as last_name, users_email,
            ds.cafedra_id, cf.cafedra_name
            from students_discipline as sd join users as u
            on sd.users_id = u.users_id join role on u.role_id = role.role_id
            join discipline as ds on sd.discipline_id = ds.discipline_id 
            join cafedra as cf on ds.cafedra_id = cf.cafedra_id where sd.users_id = ${id} limit 1;`, {id})

        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};


