const { proxy_main } = require('../config/axios.config');

module.exports.generateDocument = async function (req, res) {
    try {
        const { data } = req.body;

        // Отправляем данные на конечный сервер для генерации документа
        const response = await proxy_main.post('/api/document/download', { data });

        // Проверяем статус ответа
        if (response.status === 200) {
            // Если генерация прошла успешно, получаем сгенерированный документ
            const generatedDoc = response.data;

            // Отправляем сгенерированный документ клиенту
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': 'attachment; filename="document.docx"',
                'Content-Length': generatedDoc.length,
            });
            res.send(generatedDoc);
        } else {
            // Если произошла ошибка при генерации на конечном сервере
            res.status(500).json({
                message: 'Произошла ошибка при генерации документа',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
}

const axios = require('axios');

module.exports.uploadFile = async function (req, res) {
    try {
        const { stringData } = req.body;
        const file = req.file;

        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);

        formData.append('stringData', stringData);

        const response = await axios.post('http://localhost:8000/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Произошла ошибка',
        });
    }
};

