const { db } = require('../configs/postgresConfig')

module.exports.getPublications = async function (req, res) {
    const { field : field_query, direction: dr, search } = req.query
    const field = field_query ?? 'publication_year';
    const direction = dr ?? 'desc';
  try {
        const where_query = search? `WHERE (publication_author|| ' ' || publication_title|| ' ' || company_name || ' ' || publication_year)
              ILIKE '%' || $1 || '%'` : ''
        const result = await db.manyOrNone(`
          SELECT publication_id as id, publication_author, publication_title, publication_year, publication_cost, company_name
          FROM publication JOIN company ON publication.company_id = company.company_id ${where_query}
          ORDER BY ${field} ${direction} LIMIT 30;`, [search])
        const totalCount = await db.one(`SELECT COUNT(*) FROM publication`)
      result.push({totalCount: totalCount.count})
      return res.status(200).json(result)
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
        const result = await db.one('SELECT publication_author, publication_title, publication_year, publication_cost, company_name FROM publication JOIN company ON publication.company_id = company.company_id WHERE publication_id = $1',
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

module.exports.searchPublications = async function (req, res) {
    const { str } = req.body
    try {
        const result = await db.many(`select publication_id, publication_author, publication_title, company_name, 
                                        publication_year from publication as pb  
                                        join company on pb.company_id = company.company_id
                                      where (publication_author|| ' ' || publication_title|| ' ' || company_name || ' ' || publication_year) 
                                      ILIKE '%' || $1 || '%';`,
            [str])
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};
