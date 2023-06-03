const StudentsGroupSchema = {
    tableName: 'students_group',
    tableHeaders: [
        {
            title: 'ID',
            name:'students_group_id',
            type: 'number',
            disabled: true
        },
        {
            title: 'Группа',
            name:'students_group_name',
            type: 'string'
        },
        {
            title: 'Кол-во студентов',
            name:'students_group_count',
            type: 'number'
        }
    ]
};

module.exports = StudentsGroupSchema;
