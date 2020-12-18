const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: 'shorturls'
});

module.exports = connection;