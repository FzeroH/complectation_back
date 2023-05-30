const DisciplineSchema = {
    tableName: 'discipline',
    tableHeaders: [
        {
            title: 'ID',
            name:'discipline_id',
            type: 'number',
            disabled: true
        },
        {
            title: 'Предмет',
            name:'discipline_name',
            type: 'string'
        },
    ]
};

module.exports = DisciplineSchema;
