const { db } = require('../configs/postgresConfig')

module.exports.createRequest = async function(req,res) {
    const { pub_type_id, publication_id, users_id, students_discipline_ids, request_count } = req.body
    try {
        await db.tx(async (transaction) => {
            const {request_id} = await transaction.one(`
            INSERT INTO publication_request(pub_type_id, publication_id, finaly_request_id, users_id, request_status_id, request_count) 
            VALUES ($1, $2, null, $4, $5, $6) RETURNING request_id`,
                [pub_type_id, publication_id, null, 2, 1, request_count]);
            const values = students_discipline_ids.map((students_discipline_id) => {
                return [students_discipline_id, request_id];
            });
            console.log(values)
            for (const [students_discipline_id, request_id] of values) {
                await transaction.none(`
        INSERT INTO pub_req_students_discipline(students_discipline_id, request_id) 
        VALUES ($1, $2)`,
                    [students_discipline_id, request_id]);
            }
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

module.exports.changeRequestStatus = async function(req,res) {
    const { orderId, status} = req.body
    try {
        await db.none(
            `UPDATE publication_request SET request_status_id = $2 
                   WHERE request_id = $1`,[orderId, status])
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

module.exports.getRequests = async function(req,res) {
    try {
        const result = await db.manyOrNone(
            `SELECT request_id, pub_type_name, publication_title, finaly_request_id, users_first_name,
                    users_last_name, request_status_name, request_count
             FROM publication_request as pr
             JOIN publication_type as pt ON pr.pub_type_id = pt.pub_type_id
             JOIN request_status as rs ON pr.request_status_id = rs.request_status_id
             JOIN publication as pub ON pr.publication_id = pub.publication_id
             JOIN users as us ON pr.users_id = us.users_id;`)
        res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
}

module.exports.getRequestsByUserId = async function(req,res) {
    const { id } = req.query
    try {
        const result = await db.manyOrNone(
            `SELECT pr.request_id as id, request_status_name as status, cafedra_name,
                    publication_author, publication_title, company_name, publication_year, pub_type_name,
                    request_count, (publication_cost * request_count) as publication_cost,
                    ARRAY_AGG(
                            JSON_BUILD_OBJECT(
                                    'discipline_name', ds.discipline_name,
                                    'students_group_type_name', sgt.students_group_type_name,
                                    'students_group_name', sgt.students_group_type_name,
                                    'students_discipline_semester', sd.students_discipline_semester
                                )
                        ) as recommend_list
             FROM publication_request as pr
                      JOIN publication_type as pt ON pr.pub_type_id = pt.pub_type_id
                      JOIN request_status as rs ON pr.request_status_id = rs.request_status_id
                      JOIN publication as pub ON pr.publication_id = pub.publication_id
                      JOIN company as cp ON pub.company_id = cp.company_id
                      JOIN users as us ON pr.users_id = us.users_id
                      JOIN pub_req_students_discipline as prsd ON prsd.request_id = pr.request_id
                      JOIN students_discipline as sd ON prsd.students_discipline_id = sd.students_discipline_id
                      JOIN discipline as ds ON sd.discipline_id = ds.discipline_id
                      JOIN cafedra as cf ON ds.cafedra_id = cf.cafedra_id
                      JOIN students_group as sg ON sd.students_group_id = sg.students_group_id
                      JOIN students_group_type as sgt ON sg.students_group_type_id = sgt.students_group_type_id
             WHERE pr.users_id = $1
             GROUP BY pr.request_id, request_status_name, cafedra_name,
                      publication_author, publication_title, company_name, publication_year, pub_type_name,
                      request_count, publication_cost;`,
            [+id]
        );
        res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
}

module.exports.getFilteredRequest = async function(req,res) {
    const { id } = req.query
    try {
        await db.main(
            `SELECT request_id, pub_type_name, publication_title, company_name, finaly_request_id, users_first_name,
                    users_last_name, request_status_name, request_count
             FROM publication_request as pr
                      JOIN publication_type as pt ON pr.pub_type_id = pt.pub_type_id
                      JOIN request_status as rs ON pr.request_status_id = rs.request_status_id
                      JOIN publication as pub ON pr.publication_id = pub.publication_id
                      JOIN users as us ON pr.users_id = us.users_id
                      JOIN company as cp ON pub.company_id = cp.company_id
             WHERE pub.company_id = $1;`,[id])
        res.status(200).json({
            message:"Успешно"
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
} // TODO убрать нахер и сделать фильтрацию в getRequests

module.exports.createOrder = async function (req,res){
    const { users_id, publication_request_ids } = req.body
    try {
        const date = new Date()
        const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`

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
