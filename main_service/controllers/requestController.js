const { db } = require('../configs/postgresConfig')

module.exports.createRequest = async function(req,res) {
    const { pub_type_id, publication_id, users_id, request_status_id, students_discipline_ids } = req.body
    try {
        await db.tx(async (transaction) => {
            const pubReqId = await transaction.one(`
            INSERT INTO publication_request(pub_type_id, publication_id, finaly_request_id, users_id, request_status_id, request_count) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING publication_request_id`,
                [pub_type_id, publication_id, null, users_id, request_status_id, request_count]);
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
}

module.exports.updateRequestStatus = async function(req,res) {
    const { request_id, request_status_id} = req.body
    try {
        await db.none(
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

module.exports.createFinalyRequest = async function (req,res){
    const { users_id, publication_request_ids } = req.body
    try {
        const date = new Date()
        const formattedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`

        await db.tx( async (transaction) => {
            const finalyReqId = transaction.one(
                `INSERT INTO finaly_request(users_id, finaly_request_date, finaly_cost) 
                    VALUES ($1,$2,$3) RETYRNING finaly_request_id`,[users_id, formattedDate]);
            const values = publication_request_ids.map((publication_request_id) => {
                return [publication_request_id, finalyReqId.finaly_request_id];
            });
            await transaction.batch(`UPDATE publication_request(finaly_request_id) SET finaly_request_id = $2 WHERE publication_request_id = $1`, values);
        });
        res.status(200).json({
            message:"Успешно"
        });
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        });
    }
}
