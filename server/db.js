var mysql = require('mysql2');
var dotenv = require('dotenv');

dotenv.config();

var connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});

connection.connect((err) => {
	if (err) {
		console.error('Error connecting to MySQL:', err);
		return;
	}
	console.log('Connected to MySQL database');
});

module.exports = connection;
