const StudentsGroupSchema = {
    tableName: 'students_discipline',
    tableHeaders: [
        {
            title: 'ID',
            name:'students_discipline_id',
            type: 'integer'
        },
        {
            title: 'Предмет',
            name:'discipline_name',
            type: 'string'
        },
        {
            title: 'Преподаватель',
            name:'users_name',
            type: 'string'
        },
        {
            title: 'Группа',
            name:'students_group_name',
            type: 'string'
        },
        {
            title: 'Семестр',
            name:'students_discipline_semester',
            type: 'integer'
        }
    ]
};

module.exports = StudentsGroupSchema;