const { proxy_main } = require('../config/axios.config');

module.exports.getTables = async function (req, res) {
    try {
        const result = await proxy_main.get('/api/admin/table-list');
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getColumns = async function (req, res) {
    try {
        const response = await proxy_main.get('/api/admin/table-columns');
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

module.exports.getUsers = async function (req, res) {
    try {
        const response = await proxy_main.get('/api/admin/users');
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

module.exports.addUser = async function (req, res) {
    try {
        const response = await proxy_main.post('/api/admin/users', req.body);
        res.status(201).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

module.exports.changeUser = async function (req, res) {
    const userId = req.params.id;
    try {
        const response = await proxy_main.put(`/api/admin/users/${userId}`, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

module.exports.getStudentsDiscipline = async function (req, res) {
    try {
        const response = await proxy_main.get('/api/admin/students_discipline');
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

module.exports.addStudentsDiscipline = async function (req, res) {
    try {
        const response = await proxy_main.post('/api/admin/students_discipline', req.body);
        res.status(201).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

module.exports.changeStudentsDiscipline = async function (req, res) {
    const studentsDisciplineId = req.params.id;
    try {
        const response = await proxy_main.put(`/api/admin/students_discipline/${studentsDisciplineId}`, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

module.exports.getCompany = async function (req, res) {
    try {
        const result = await proxy_main.get('/api/admin/company');
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.addCompany = async function (req, res) {
    try {
        const { body } = req;
        const result = await proxy_main.post('/api/admin/company', body);
        res.status(201).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.changeCompany = async function (req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const result = await proxy_main.put(`/api/admin/company/${id}`, body);
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getStudentsGroup = async function (req, res) {
    try {
        const result = await proxy_main.get('/api/admin/students_group');
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.addStudentsGroup = async function (req, res) {
    try {
        const { body } = req;
        const result = await proxy_main.post('/api/admin/students_group', body);
        res.status(201).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.changeStudentsGroup = async function (req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const result = await proxy_main.put(`/api/admin/students_group/${id}`, body);
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getDiscipline = async function (req, res) {
    try {
        const result = await proxy_main.get('/api/admin/discipline');
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.addDiscipline = async function (req, res) {
    try {
        const { body } = req;
        const result = await proxy_main.post('/api/admin/discipline', body);
        res.status(201).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.changeDiscipline = async function (req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const result = await proxy_main.put(`/api/admin/discipline/${id}`, body);
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}
