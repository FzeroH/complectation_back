const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const path = require('path')

module.exports.generateDocument = async function (req,res){
    const test = req.body
    const abs = path.resolve(__dirname,'../doc_templates/template_tab.docx')
    const content = fs.readFileSync(abs, 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip);

    doc.setData(test);

    doc.render();

    const generatedDocument = doc.getZip().generate({ type: 'nodebuffer' });

    await fs.writeFileSync(`${__dirname}/../public/${test.title}.docx`, generatedDocument);
    res.on('finish', () => {
        fs.unlink(`${__dirname}/../public/${test.title}.docx`, (err) => {
            if (err) {
                console.error('Ошибка при удалении файла:', err);
                return;
            }
            console.log('Файл успешно удален');
        });
    });
    await res.download(`${__dirname}/../public/${test.title}.docx`, (err) => {
        if (err) {
            res.status(500).send(`При загрузке файла произошла ошибка:\n${err}`)
            console.log(err)
        }
    })
}
