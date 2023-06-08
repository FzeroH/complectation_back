const { proxy_main } = require('../config/axios.config');

module.exports.getPublications = async function (req, res) {
    const { field : field_query, direction: dr, page, search } = req.query
    const field = field_query ?? 'publication_year';
    const direction = dr ?? 'desc';
    try {
        const response = await proxy_main.get(`/api/publications/?field=${field}&direction=${direction}&page=${page}&search=${search}`);
        const publications = response.data;
        res.status(200).json(publications);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Произошла ошибка: ${error}`,
        });
    }
}

module.exports.getPublicationById = async function (req, res) {
    try {
        const id = req.query.id;
        const response = await proxy_main.get(`/api/publication/?id=${id}`);
        const publication = response.data;
        publication.cafedra_name = req.session.user.cafedra_name;

        res.status(200).json(publication);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getPublicationType = async function (req, res) {
    try {
        const response = await proxy_main.get('/api/pub_types');
        const pubTypes = response.data;
        res.status(200).json(pubTypes);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

