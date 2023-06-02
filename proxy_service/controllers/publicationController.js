const { proxy_main } = require('../config/axios.config');

module.exports.getPublications = async function (req, res) {
    try {
        const response = await proxy_main.get('/api/publications');
        const publications = response.data;
        res.status(200).json(publications);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getPublicationById = async function (req, res) {
    try {
        const publicationId = req.params.id;
        const response = await proxy_main.get(`/api/publication/${publicationId}`);
        const publication = response.data;
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

