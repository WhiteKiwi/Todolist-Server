const DB = require('../utils/database');
const { Q } = require('../utils/constants');

class TodoRepository {
	constructor() {
		this.db = new DB();
	}

	async readAll(userUUID) {
		const query = `\
			SELECT uuid, title, is_achieved as isAchieved \
			FROM todos \
			WHERE user_uuid=${Q}`;
		const params = [userUUID];
		const data = await this.db.query(query, params);

		// TODO: 작동 확인
		data.forEach((row) => {
			row.isAchieved = row.isAchieved ? true : false;
		});

		return data;
	}

	async read(userUUID, todoUUID) {
		const query = `\
			SELECT uuid, title, is_achieved as isAchieved \
			FROM todos \
			WHERE user_uuid=${Q} and uuid=${Q}`;
		const params = [userUUID, todoUUID];
		const data = await this.db.query(query, params);

		if (data[0])
			data[0].isAchieved = data[0].isAchieved ? true : false;

		return data[0];
	}

	async create(userUUID, title) {
		const query = `\
			INSERT INTO todos(title, user_uuid) \
			VALUES(${Q}, ${Q})`;
		const params = [title, userUUID];
		const data = await this.db.query(query, params);

		return data.affectedRows > 0 ? true : false;
	}

	async update(userUUID, todo) {
		const params = [];
		
		let subQuery=[];
		for(let key in todo) {
			if (key == 'title') {
				subQuery.push(`title=${Q}`);
				params.push(todo[key]);
			} else if (key == 'isAchieved') {
				subQuery.push(`is_achieved=${Q}`);
				params.push(todo[key] == true ? 1 : 0);
			}
		}
		if (subQuery.length == 0)
			return false;

		const query = `\
			UPDATE todos \
			SET ${subQuery.join(', ')} \
			WHERE user_uuid=${Q} AND uuid=${Q}`;
		params.push(userUUID);
		params.push(todo.uuid);
		const data = await this.db.query(query, params);

		return data.affectedRows > 0 ? true : false;
	}

	async delete(userUUID, todoUUID) {
		const query = `\
			DELETE FROM todos \
			WHERE user_uuid=${Q} and uuid=${Q}`;
		const params = [userUUID, todoUUID];
		const data = await this.db.query(query, params);

		return data.affectedRows > 0 ? true : false;
	}
}

module.exports = TodoRepository;
