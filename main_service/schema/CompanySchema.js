const CompanySchema = {
    tableName: 'company',
    tableHeaders: [
        {
            title: 'ID',
            name:'company_id',
            type: 'number'
        },
        {
            title: 'Название издательства',
            name:'company_name',
            type: 'string'
        }
    ]
};

module.exports = CompanySchema;
