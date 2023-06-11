const { proxy_main, proxy_parser } = require('../config/axios.config');

module.exports.generateDocument = async function (req, res) {
    const { order_id } = req.query;
    try {

        const response = await proxy_main.get(`/api/document/download?order_id=${order_id}`, {
            responseType: 'arraybuffer',
        });


        if (response.status === 200) {

            const generatedDoc = response.data;


            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': 'attachment; filename="order.docx"',
                'Content-Length': generatedDoc.length,
            });


            res.send(Buffer.from(generatedDoc, 'binary'));
        } else {

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


module.exports.uploadFile = async function (req, res) {
    try {
        const { company_name } = req.body;
        const file = req.file;
        console.log(file)

        const blob = new Blob([file.buffer], { type: file.mimetype });

        const formData = new FormData();

        formData.append('file', blob, file.originalname);
        formData.append('company_name', company_name);

        const response = await proxy_parser.post('/api/file/upload', formData, {
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


