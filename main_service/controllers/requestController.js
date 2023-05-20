const { db } = require('../configs/postgresConfig')

module.exports.getPublications = async function (req,res) {
  try {
      const result = await db.many('SELECT publication_author, publication_title, publication_year, publication_cost, company_name FROM publication JOIN company ON publication.company_id = company.company_id;')
      return res.status(200).json(result)
  } catch (e) {
      console.error(e)
      res.status(500).json({
          message: "Произошла ошибка"
      })
  }
};

module.exports.createRequest = async function(req,res) {
    const { pub_type_id, publication_id, users_id, request_status_id, request_count } = req.body
    try {
        await db.tx(async (transaction) => {
            await transaction.none(`
        WITH pub_req AS (
          INSERT INTO publication_request(pub_type_id, publication_id, finaly_request_id, users_id, request_status_id, request_count)
          VALUES ($1, $2, $3, $4, $5, $6)
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
}

module.exports.colleteRequest = async function(req,res) {
    try {

    } catch (e) {

    }
}
