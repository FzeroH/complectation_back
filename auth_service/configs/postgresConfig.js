const pgp = require("pg-promise")();
const db = pgp(`postgres://${ process.env.DB_LOGIN }:${ process.env.DB_PASSWORD }@${ process.env.DB_HOST }:${ process.env.DB_PORT }/${ process.env.DB_NAME }`);

module.exports = { db }