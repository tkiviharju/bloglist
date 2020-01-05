/*eslint no-undef:*/
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog.js');
const User = require('../models/user.js');
const api = supertest(app);
const mocks = require('./mocks.js');

const initialBlogs = mocks.listWithManyBlogs;

let savedUser;
let token;

beforeAll(async () => {
	// creating a user and logging in
	await User.deleteMany({});
	const response = await api.post('/api/users')
		.send(mocks.newUser);
	savedUser = response.body;

	const { username, password } = mocks.newUser;
	const loginRes = await api.post('/api/login')
		.send({ username, password });

	token = loginRes.body.token;

});


beforeEach(async () => {
	await Blog.deleteMany({});

	const blogs = initialBlogs.map(blog => {
		blog.user = savedUser.id;
		return new Blog(blog);
	});
	resp = await Blog.insertMany(blogs);
});


test('logged user can add a blog', async () => {
	const newBlog = mocks.listWithOneBlog[0];
	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(newBlog)
		.set('Accept', 'application/json')
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const response = await api.get('/api/blogs');
	const { length } = response.body;
	expect(length).toBe(initialBlogs.length + 1);

});


test('a blog without title or url returns 400', async () => {
	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(mocks.blogWithNoTitleAndUrl)
		.expect(400);
});


test('a blog with not likes assigned has zero likes', async () => {
	const response = await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(mocks.blogWithNoLikes);

	const { likes } = response.body;
	expect(likes).toBeDefined();
	expect(likes).toBe(0);
});


test('returned blog has id field', async () => {
	const response = await api.get('/api/blogs');
	const { id } = response.body[0];
	expect(id).toBeDefined();
});


test('all blogs are returned', async () => {
	const response = await api.get('/api/blogs');
	const { length } = response.body;
	expect(length).toBe(initialBlogs.length);
});


test('the first blog is about react patterns', async () => {
	const response = await api.get('/api/blogs');
	const { title } = response.body[0];
	expect(title).toBe('React patterns');
});


test('blogs are returned as JSON', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);
});


describe('deleting a blog', () => {
	// log in happens in beforeAll() method

	test('added by the user succeeds when the user is logged in', async () => {
		let result  = await api.get('/api/blogs');

		const initialBlogs = result.body;
		const initialLength = initialBlogs.length;
		const { id } = initialBlogs[0];

		await api.delete(`/api/blogs/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204);

		result = await api.get('/api/blogs');
		const blogsAfter = result.body;

		const lengthAfter = blogsAfter.length;
		expect(lengthAfter).toBe(initialLength - 1);

		const blogsAfterIds = blogsAfter.map(blog => blog.id);
		expect(blogsAfterIds.includes(id)).toBe(false);
	});


	test('when no auth token is provided (user is not logged in) fails', async () => {
		const blog = (await Blog.findOne()).toJSON();
		let id = blog.id;

		await api.delete(`/api/blogs/${id}`)
			.expect(401);


		// blog is still saved in db
		await api.get(`/api/blogs/${id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});


	test('added by another user fails', async () => {
		let blog = mocks.blogWithNoLikes;
		blog.user = '5e11af7f94bbc99980722a20';
		blog = new Blog(blog);

		const savedBlog = await blog.save();
		const { id } = savedBlog;

		await api.delete(`/api/blogs/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(401);
	});
});


afterAll(() => {
	mongoose.connection.close();
});
