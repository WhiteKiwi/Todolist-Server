const mysql = require('mysql');
require('dotenv').config();

const db_info = {
	host: process.env.DB_ADDR || 'localhost',
	user: process.env.MYSQL_ID || 'mysql',
	password: process.env.MYSQL_PW || '',
	database: process.env.MYSQL_DATABASE || 'todolist_dev',
	port: process.env.MYSQL_PORT || '3306'
};

module.exports = {
	connect: function() {
		return mysql.createConnection(db_info);
	},
	'SALT': process.env.SALT || 'localTest'
};
