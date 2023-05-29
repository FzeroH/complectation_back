const StudentsGroupSchema = {
    tableName: 'students_group',
    tableHeaders: [
        {
            title: 'ID',
            name:'students_group_id',
            type: 'integer'
        },
        {
            title: 'Кафедра',
            name:'cafedra_name',
            type: 'string'
        },
        {
            title: 'Тип группы',
            name:'students_group_type_name',
            type: 'string'
        },
        {
            title: 'Группа',
            name:'students_group_name',
            type: 'string'
        },
        {
            title: 'Кол-во студентов',
            name:'students_group_count',
            type: 'integer'
        }
    ]
};

module.exports = StudentsGroupSchema;