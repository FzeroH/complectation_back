const axios = require('axios')

const proxy_main = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
});

const proxy_parser = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 5000,
});

module.exports = { proxy_main, proxy_parser }
