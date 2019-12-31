/*eslint no-undef:*/
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const User = require('../models/user.js');
const api = supertest(app);
const { usersInDb } = require('./test_helper.js');
const { createPasswordHash } = require('../utils/helpers.js');


describe('When there is a single user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const user = new User({ username: 'root', name: 'master' });

		const password = 'secretForbidden';
		user.passwordHash = await createPasswordHash(password);

		await user.save();
	});

	test('creates a new user successfully', async () => {
		const usersAtStart = await usersInDb();
		const newUser = {
			username: 'mikromikko',
			name: 'Mikko Mikkonen',
			password: 'canonicalsecret'
		};

		await api.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await usersInDb();
		expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

		const usernames = usersAtEnd.map(u => u.username);
		expect(usernames).toContain(newUser.username);
	});
});


afterAll(() => {
	mongoose.connection.close();
});