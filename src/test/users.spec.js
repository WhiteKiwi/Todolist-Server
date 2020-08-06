const request = require('supertest');
const app = require('../app');
require('chai').should();

const testUser = {
	'userID': 'testUserQwerQwer',
	'password': 'testPassword',
	'nickname': 'TestKiwi'
};

let accessToken;
// let refreshToken;

// TODO: Test DB 분리하기

describe('POST /users', () => {
	it('회원가입', (done) => {
		request(app)
			.post('/users')
			.send({
				userID: testUser.userID,
				password: testUser.password,
				nickname: testUser.nickname
			})
			.expect(201)
			.end((err, res) => {
				if (err)
					done(err);
				else
					done();
			});
	});

	it('회원가입 - 이미 존재하는 User', (done) => {
		request(app)
			.post('/users')
			.send({
				userID: testUser.userID,
				password: testUser.password,
				nickname: testUser.nickname
			})
			.expect(409)
			.end((err, res) => {
				if (err)
					done(err);
				else
					done();
			});
	});
});

describe('GET /users/verify-user-id', () => {
	it('User ID 중복검사 - 존재 O', (done) => {
		request(app)
			.get(`/users/verify-user-id?userID=${testUser.userID}`)
			.expect(200)
			.end((err, res) => {
				if (err)
					done(err);
				else {
					res.body.OK.should.be.equal(true);

					done();
				}
			});
	});

	it('User ID 중복검사 - 존재 X', (done) => {
		request(app)
			.get(`/users/verify-user-id?userID=${testUser.userID + 'a'}`)
			.expect(200)
			.end((err, res) => {
				if (err)
					done(err);
				else {
					res.body.OK.should.be.equal(false);

					done();
				}
			});
	});
});

describe('GET /users/verify-nickname', () => {
	it('Nickname 중복검사 - 존재 O', (done) => {
		request(app)
			.get(`/users/verify-nickname?nickname=${testUser.nickname}`)
			.expect(200)
			.end((err, res) => {
				if (err)
					done(err);
				else {
					res.body.OK.should.be.equal(false);

					done();
				}
			});
	});

	it('Nickname 중복검사 - 존재 X', (done) => {
		request(app)
			.get(`/users/verify-nickname?nickname=${testUser.nickname + 'a'}`)
			.expect(200)
			.end((err, res) => {
				if (err)
					done(err);
				else {
					res.body.OK.should.be.equal(true);

					done();
				}
			});
	});
});

describe('POST /users/sign-in', () => {
	it('로그인', (done) => {
		request(app)
			.post('/users/sign-in')
			.send({
				userID: testUser.userID,
				password: testUser.password
			})
			.expect(200)
			.end((err, res) => {
				if (err)
					done(err);
				else {
					accessToken = res.body.accessToken;
					// refreshToken = res.body.refreshToken;

					done();
				}
			});
	});
});

describe('GET /users/', () => {
	it('내 정보 가져오기', (done) => {
		request(app)
			.get('/users/')
			.expect(200)
			.set({ 'Authorization': `Bearer ${accessToken}` })
			.end((err, res) => {
				if (err)
					done(err);
				else {
					res.body.userID.should.be.equal(testUser.userID);
					res.body.nickname.should.be.equal(testUser.nickname);

					done();
				}
			});
	});
});

describe('DELETE /users/', () => {
	it('회원탈퇴 - Incorrect Password', (done) => {
		request(app)
			.delete('/users/')
			.set({ 'Authorization': `Bearer ${accessToken}` })
			.send({
				password: testUser.password + '2'
			})
			.expect(401)
			.end((err, res) => {
				if (err)
					done(err);
				else
					done();
			});
	});

	it('회원탈퇴', (done) => {
		request(app)
			.delete('/users/')
			.set({ 'Authorization': `Bearer ${accessToken}` })
			.send({
				password: testUser.password
			})
			.expect(204)
			.end((err, res) => {
				if (err)
					done(err);
				else
					done();
			});
	});
});