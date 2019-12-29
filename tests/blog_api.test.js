/*eslint no-undef:*/
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog.js');
const api = supertest(app);
const { listWithManyBlogs } = require('./mocks.js');

beforeEach(async () => {
	await Blog.deleteMany({});
	const blogs = listWithManyBlogs.map(blog => new Blog(blog));
	await Blog.insertMany(blogs);
});

test('returned blog has id field', async () => {
	const response = await api.get('/api/blogs');
	const { id } = response.body[0];
	expect(id).toBeDefined();
});

test('all blogs are returned', async () => {
	const response = await api.get('/api/blogs');
	const { length } = response.body;
	expect(length).toBe(listWithManyBlogs.length);
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

afterAll(() => {
	mongoose.connection.close();
});
