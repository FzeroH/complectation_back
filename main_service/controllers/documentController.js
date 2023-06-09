const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const path = require('path');
const { db } = require('../configs/postgresConfig');

module.exports.generateDocument = async function (req,res){
    const { order_id } = req.query
    try {
        const result =await db.many(`
              SELECT publication_author, publication_title,
              company_name, publication_year, request_count, publication_cost, finaly_cost as total_price
              FROM publication_request as pr
              JOIN finaly_request as fr ON pr.finaly_request_id = fr.finaly_request_id
              JOIN publication as pub ON pr.publication_id = pub.publication_id
              JOIN company as cp ON pub.company_id = cp.company_id
              JOIN users as us ON pr.users_id = us.users_id
              WHERE pr.finaly_request_id = $1;
            `, [+order_id]
        );

        const abs = path.resolve(__dirname,'../doc_templates/template_tab.docx')
        const content = fs.readFileSync(abs, 'binary');
        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip);

        const total_price = result[0].total_price;
        const company_name = result[0].company_name;

        doc.render({
            company_name,
            total_price,
            result,
        });

        const generatedDocument = doc.getZip().generate({ type: 'nodebuffer' });

        await fs.writeFileSync(`${__dirname}/../public/order.docx`, generatedDocument);
        res.on('finish', () => {
            fs.unlink(`${__dirname}/../public/order.docx`, (err) => {
                if (err) {
                    console.error('Ошибка при удалении файла:', err);
                    return;
                }
                console.log('Файл успешно удален');
            });
        });
        await res.download(`${__dirname}/../public/order.docx`, (err) => {
            if (err) {
                res.status(500).send(`При загрузке файла произошла ошибка:\n${err}`)
                console.log(err)
            }
        })
    } catch (e) {
        res.status(500).json({
            message: `Произошла ошибка\n${e}`
        })
    }

}
