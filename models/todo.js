const connection = require('../configs/database.js').connect();

module.exports = {
	// Get All Todos
	getTodos: function (user) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT todos.uuid, todos.title, todos.is_achieved from todos left join users on users.uuid='${user.uuid}'`, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}
				resolve(rows);
			});
		});
	},
	// Get Todo Info
	getTodo: function (user, todo_uuid) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT todos.* from todos left join users on users.uuid='${user.uuid}' where todos.uuid='${todo_uuid}'`, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}
				resolve(rows[0]);
			});
		});
	}
};
