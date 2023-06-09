const { proxy_main } = require('../config/axios.config');

module.exports.generateDocument = async function (req, res) {
    const { order_id } = req.query;
    try {
        // Отправляем запрос на конечный сервер для генерации документа
        const response = await proxy_main.get(`/api/document/download?order_id=${order_id}`, {
            responseType: 'arraybuffer', // Указываем, что ожидаем массив байтов в ответе
        });

        // Проверяем статус ответа
        if (response.status === 200) {
            // Если генерация прошла успешно, получаем сгенерированный документ в виде массива байтов
            const generatedDoc = response.data;

            // Устанавливаем заголовки для отправки файла клиенту
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': 'attachment; filename="order.docx"',
                'Content-Length': generatedDoc.length,
            });

            // Отправляем сгенерированный документ клиенту
            res.send(Buffer.from(generatedDoc, 'binary'));
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
};


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

