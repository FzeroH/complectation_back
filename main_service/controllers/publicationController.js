const { db } = require('../configs/postgresConfig')

module.exports.getPublications = async function (req, res) {
    // const { field : field_query, direction: dr, page, search } = req.query
    // console.log(dr)
    // const field = field_query ?? 'publication_year';
    // const direction = dr ?? 'desc';
    // console.log(`field: ${field}, direction:${direction}`)
    const {field, direction, page, search} = req.query
  try {
        const where_query = search? `WHERE (publication_author|| ' ' || publication_title|| ' ' || company_name || ' ' || publication_year)
              ILIKE '%' || '${search}' || '%'` : ''
        const query = `SELECT publication_id as id, publication_author, publication_title, publication_year, publication_cost, company_name
          FROM publication JOIN company ON publication.company_id = company.company_id ${where_query}`

        const result = await db.manyOrNone(`${query} ORDER BY ${field} ${direction} LIMIT 30 OFFSET 30*(${page} - 1);`,
            {query, field, direction, page, search})

        const totalCount = await db.one(`SELECT COUNT(*) FROM (${query}) book`)

      return res.status(200).json({data: result, total: totalCount.count})
  } catch (e) {
      console.error(e)
      res.status(500).json({
          message: "Произошла ошибка"
      })
  }
};

module.exports.getPublicationById = async function (req, res) {
    const { id } = req.query
    try {
        const result = await db.one(`SELECT publication_author, publication_title, publication_year, publication_cost, company_name 
                FROM publication JOIN company ON publication.company_id = company.company_id 
                WHERE publication_id = $1`,
            [id])
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};

module.exports.getPublicationType = async function (req, res) {
    try {
        const result = await db.many(`SELECT pub_type_id as value, pub_type_name as title FROM publication_type `)
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};
