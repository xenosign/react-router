const mysql = require('mysql');

const { MYSQL_PASSWORD } = process.env;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: MYSQL_PASSWORD,
  port: '3306',
  database: 'mydb1',
});

connection.connect();

module.exports = connection;
