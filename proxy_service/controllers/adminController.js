const { proxy_main } = require('../config/axios.config');
const fs = require('fs');
const path = require('path');

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
    const { tableName } = req.query
    try {
        const response = await proxy_main.get(`/api/admin/table-columns/?tableName=${tableName}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

module.exports.getUsers = async function (req, res) {
    const { sorting : sort } = req.query
    const field = sort?.field ?? 'users_id';
    const direction = sort?.direction ?? 'asc';
    try {
        const response = await proxy_main.get(`/api/admin/users/?field=${field}&direction=${direction}`);
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
        const { users_email, users_password } = response.data;

        // const fileContent = `email: ${users_email}, password: ${users_password}`;
        // const fileName = `${users_email}_info.txt`;
        // const filePath = path.join(__dirname, '..', 'public', fileName);
        //
        // fs.writeFileSync(filePath, fileContent);
        res.status(200).json({
            message:'Пользователь успешно создан',
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

// module.exports.download

module.exports.changeUser = async function (req, res) {
    try {
        const response = await proxy_main.put(`/api/admin/users`, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

module.exports.getStudentsDiscipline = async function (req, res) {
    const { sorting : sort } = req.query
    const field = sort?.field ?? 'students_discipline_id';
    const direction = sort?.direction ?? 'asc';

    try {
        const response = await proxy_main.get(`/api/admin/students_discipline/?field=${field}&direction=${direction}`);
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
    try {
        const response = await proxy_main.put(`/api/admin/students_discipline`, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

module.exports.getCompany = async function (req, res) {
    const { sorting : sort } = req.query
    const field = sort?.field ?? 'company_id';
    const direction = sort?.direction ?? 'asc';

    try {
        const result = await proxy_main.get(`/api/admin/company/?field=${field}&direction=${direction}`);
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
        const { body } = req;
        const result = await proxy_main.put(`/api/admin/company`, body);
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getStudentsGroup = async function (req, res) {
    const { sorting : sort } = req.query
    const field = sort?.field ?? 'students_group_id';
    const direction = sort?.direction ?? 'asc';

    try {
        const result = await proxy_main.get(`/api/admin/students_group/?field=${field}&direction=${direction}`);
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
        const { body } = req;
        const result = await proxy_main.put(`/api/admin/students_group`, body);
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

module.exports.getDiscipline = async function (req, res) {
    const { sorting : sort } = req.query
    const field = sort?.field ?? 'discipline_id';
    const direction = sort?.direction ?? 'asc';

    try {
        const result = await proxy_main.get(`/api/admin/discipline/?field=${field}&direction=${direction}`);
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
        const { body } = req;
        const result = await proxy_main.put(`/api/admin/discipline`, body);
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}
