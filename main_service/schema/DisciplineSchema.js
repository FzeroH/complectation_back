const DisciplineSchema = {
    tableName: 'discipline',
    tableHeaders: [
        {
            title: 'ID',
            name:'discipline_id',
            type: 'integer'
        },
        {
            title: 'Кафедра',
            name:'cafedra_name',
            type:'string'
        },
        {
            title: 'Предмет',
            name:'discipline_name',
            type: 'string'
        },
    ]
};

module.exports = DisciplineSchema;