const { db } = require('../configs/postgresConfig')
const {fromCamel} = require("postgres");

module.exports.createRequest = async function(req,res) {
    const { pub_type_id, publication_id, users_id, students_discipline_ids, request_count } = req.body
    try {
        await db.tx(async (transaction) => {
            const {request_id} = await transaction.one(`
            INSERT INTO publication_request(pub_type_id, publication_id, finaly_request_id, users_id, request_status_id, request_count) 
            VALUES ($1, $2, null, $4, $5, $6) RETURNING request_id`,
                [pub_type_id, publication_id, null, users_id, 1, request_count]);
            const values = students_discipline_ids.map((students_discipline_id) => {
                return [students_discipline_id, request_id];
            });
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
    const { id, status} = req.body
    try {
        const {request_status_id : status_id} = await db.one(`SELECT request_status_id from request_status 
                         where request_status_name = $1`,[status])
        await db.none(
            `UPDATE publication_request SET request_status_id = $2 
                   WHERE request_id = $1`,[id, status_id])
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
    const { value, status } = req.query

    const company = value? `where pub.company_id = ${value}` : ''
    const statusCondition = status ? `where request_status_name = '${status}'` : '';

    try {
        const result = await db.manyOrNone(
            `SELECT pr.request_id AS id, request_status_name AS status, cafedra_name,
                    publication_author, publication_title, company_name, publication_year, pub_type_name,
                    request_count, publication_cost, students_group_name,
                    ARRAY_AGG(
                            JSON_BUILD_OBJECT(
                                    'discipline_name', ds.discipline_name,
                                    'students_group_type_name', sgt.students_group_type_name,
                                    'students_group_name', sg.students_group_name,
                                    'students_discipline_semester', sd.students_discipline_semester
                                )
                        ) AS recommend_list
             FROM publication_request AS pr
                      JOIN publication_type AS pt ON pr.pub_type_id = pt.pub_type_id
                      JOIN request_status AS rs ON pr.request_status_id = rs.request_status_id
                      JOIN publication AS pub ON pr.publication_id = pub.publication_id
                      JOIN company AS cp ON pub.company_id = cp.company_id
                      JOIN users AS us ON pr.users_id = us.users_id
                      JOIN pub_req_students_discipline AS prsd ON prsd.request_id = pr.request_id
                      JOIN students_discipline AS sd ON prsd.students_discipline_id = sd.students_discipline_id
                      JOIN discipline AS ds ON sd.discipline_id = ds.discipline_id
                      JOIN cafedra AS cf ON ds.cafedra_id = cf.cafedra_id
                      JOIN students_group AS sg ON sd.students_group_id = sg.students_group_id
                      JOIN students_group_type AS sgt ON sg.students_group_type_id = sgt.students_group_type_id
                 ${company}
                 ${statusCondition}
             GROUP BY pr.request_id, request_status_name, cafedra_name,
                 publication_author, publication_title, company_name, publication_year, pub_type_name,
                 request_count, publication_cost, sg.students_group_name
             ORDER BY pr.request_id DESC;`)
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
                    request_count, publication_cost, students_group_name,
                    ARRAY_AGG(
                            JSON_BUILD_OBJECT(
                                    'discipline_name', ds.discipline_name,
                                    'students_group_type_name', sgt.students_group_type_name,
                                    'students_group_name', sg.students_group_name,
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
                      request_count, publication_cost, sg.students_group_name
             ORDER BY pr.request_id DESC;`,
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

module.exports.createOrder = async function (req,res){
    const { users_id, order_ids, total_price } = req.body
    let id = 0;
    try {
        const date = new Date()
        const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
        await db.tx( async (transaction) => {
            const { finaly_request_id } = await transaction.one(
                `INSERT INTO finaly_request(users_id, finaly_request_date, finaly_cost)
                    VALUES ($1,$2,$3) RETURNING finaly_request_id`,[users_id, formattedDate, total_price]);
            const values = order_ids.map((request_id) => {
                return [request_id, finaly_request_id];
            });
            for (const [request_id, finaly_request_id] of values) {
                await transaction.none(`
                UPDATE publication_request SET finaly_request_id = $2, request_status_id = 5 WHERE request_id = $1`,
                    [request_id, finaly_request_id]);
            }
            id = finaly_request_id;
        });
        res.status(200).json({
            message:"Успешно",
            finaly_request_id: id,
        });
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        });
    }
}
