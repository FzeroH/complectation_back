const UserSchema = {
    tableName: 'users',
    tableHeaders: [
        {
            title: 'ID',
            name:'users_id',
            type: 'number',
            disabled: true
        },
        {
            title: 'Имя',
            name:'users_first_name',
            type: 'string'
        },
        {
            title: 'Фамилия',
            name:'users_last_name',
            type: 'string'
        },
        {
            title: 'E-mali',
            name:'users_email',
            type: 'string'
        }
    ]
};

module.exports = UserSchema;
