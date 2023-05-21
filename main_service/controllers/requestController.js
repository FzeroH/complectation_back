const { db } = require('../configs/postgresConfig')

module.exports.createRequest = async function(req,res) {
    const { pub_type_id, publication_id, users_id, request_status_id, request_count } = req.body
    try {
        await db.tx(async (transaction) => {
            await transaction.none(`
        WITH pub_req AS (
          INSERT INTO publication_request(pub_type_id, publication_id, finaly_request_id, users_id, request_status_id, 0)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING publication_request_id
        )
        INSERT INTO pub_req_students_discipline(students_disciplne_id, request_id)
        SELECT $7, publication_request_id FROM pub_req
      `, [pub_type_id, publication_id, null, users_id, request_status_id, request_count, students_discipline_id]);
        });
        res.status(200).json({
            message:"Успешно"
        });
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
} // Почитать про with и протестить функцию.

module.exports.updateRequestStatus = async function(req,res) {
    const { request_id, request_status_id} = req.body
    try {
        const result = await db.none(
            `UPDATE publication_request SET request_status_id = $2 
                   WHERE request_id = $1`,[request_id, request_status_id])
        res.status(200).json({
            message:"Успешно"
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
}
