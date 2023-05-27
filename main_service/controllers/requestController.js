const { db } = require('../configs/postgresConfig')

module.exports.createRequest = async function(req,res) {
    const { pub_type_id, publication_id, users_id, request_status_id, request_count } = req.body
    try {
        await db.tx(async (transaction) => {
            const pubReqId = await transaction.one(`
    INSERT INTO publication_request(pub_type_id, publication_id, finaly_request_id, users_id, request_status_id, request_count)
    VALUES ($1, $2, $3, $4, $5) RETURNING publication_request_id
  `, [pub_type_id, publication_id, null, users_id, request_status_id]);

            const values = students_discipline_ids.map((students_discipline_id) => {
                return [students_discipline_id, pubReqId.publication_request_id];
            });

            await transaction.batch(`INSERT INTO pub_req_students_discipline(students_discipline_id, request_id) 
VALUES ($1, $2)`, values);
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
