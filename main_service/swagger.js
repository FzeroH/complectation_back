const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';

const endpointsFiles = [
    './routes/admin.js',
    './routes/auth.js',
    './routes/company.js',
    './routes/document.js',
    './routes/publication.js',
    './routes/request.js',
    './routes/students_discipline.js',
    './routes/user.js',
];

const doc = {
    info: {
        title: 'Complectation API',
        description: 'Описание API',
    },
    host: 'localhost:3000',
    basePath: '/api',
    schemes: ['http'],
};

const options = {
    routes: {
        '/api/admin/table-list*': {
            name: 'Admin',
            description: 'Описание группы Admin',
        },
        '/api/admin/table-columns*': {
            name: 'Admin',
            description: 'Описание группы Admin',
        },
        '/api/admin/users*': {
            name: 'User',
            description: 'Описание группы User',
        },
        '/api/admin/students_discipline*': {
            name: 'Students and Disciplines',
            description: 'Описание группы Students and Disciplines',
        },
        '/api/admin/company*': {
            name: 'Company',
            description: 'Описание группы Company',
        },
        '/api/admin/students_group*': {
            name: 'Students Group',
            description: 'Описание группы Students Group',
        },
        '/api/admin/discipline*': {
            name: 'Discipline',
            description: 'Описание группы Discipline',
        },
        '/auth*': {
            name: 'Auth',
            description: '',
        },
        '/company*': {
            name: 'Company',
            description: '',
        },
        '/document*': {
            name: 'Document',
            description: '',
        },
        '/publication*': {
            name: 'Publication',
            description: '',
        },
        '/request*': {
            name: 'Request',
            description: '',
        },
        '/students_discipline*': {
            name: 'Students and Disciplines',
            description: '',
        },
        '/user*': {
            name: 'User',
            description: '',
        },
    },
};

swaggerAutogen(outputFile, endpointsFiles, doc, options);
