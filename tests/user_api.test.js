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

describe('When new user data is invalid', () => {
	test('don\'t allow creation with too short username', async () => {
		const newUser = {
			username: 'as',
			name: 'Al Goretex',
			password: 'valid'
		};

		await api.post('/api/users')
			.send(newUser)
			.expect(400, {
				error: 'User validation failed: username: Path `username` (`as`) is shorter than the minimum allowed length (3).'
			});
	});

	test('don\'t allow creation with too short password', async () => {
		const newUser = {
			username: 'Mastermind',
			name: 'Hamato Yoshi',
			password: 've'
		};

		await api.post('/api/users')
			.send(newUser)
			.expect(400, {
				error: 'Password is missing or shorter than minimum allowed length (3)'
			});
	});
});


afterAll(() => {
	mongoose.connection.close();
});