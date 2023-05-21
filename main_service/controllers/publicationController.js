const { db } = require('../configs/postgresConfig')

module.exports.getPublications = async function (req, res) {
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
        const result = await db.many(`SELECT pub_type_id, pub_type_name FROM publication_type `)
        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Произошла ошибка"
        })
    }
};
