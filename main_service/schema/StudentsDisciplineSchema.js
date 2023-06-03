const StudentsGroupSchema = {
    tableName: 'students_discipline',
    tableHeaders: [
        {
            title: 'ID',
            name:'students_discipline_id',
            type: 'number',
            disabled: true
        },
        {
            title: 'Семестр',
            name:'students_discipline_semester',
            type: 'number'
        }
    ]
};

module.exports = StudentsGroupSchema;
