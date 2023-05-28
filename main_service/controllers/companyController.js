const { db } = require("../configs/postgresConfig");

module.exports.getCompanyName = async function (req, res){
    try {
        const result = await db.many(`SELECT company_id as value, company_name as title FROM company `)
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};// Получить список названий издательств
