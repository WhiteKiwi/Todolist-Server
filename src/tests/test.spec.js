const request = require('supertest');
const app = require('../app');
require('chai').should();

describe('GET /', () => {
	it('Hello, world!', (done) => {
		request(app)
			.get('/')
			.expect(200)
			.end((e, res) => {
				if (e)
					done(e);
				else {
					// result Text must be 'Hello, world!'
					res.text.should.be.equal('Hello, world!');

					done();
				}
			});
	});
});
