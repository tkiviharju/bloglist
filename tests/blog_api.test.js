/*eslint no-undef:*/
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog.js');
const api = supertest(app);
const mocks = require('./mocks.js');

const initialBlogs = mocks.listWithManyBlogs;

beforeEach(async () => {
	await Blog.deleteMany({});
	const blogs = initialBlogs.map(blog => new Blog(blog));
	await Blog.insertMany(blogs);
});

test('can add a blog', async () => {
	const newBlog = mocks.listWithOneBlog[0];
	await api
		.post('/api/blogs')
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
		.send(mocks.blogWithNoTitleAndUrl)
		.expect(400);
});

test('a blog with not likes assigned has zero likes', async () => {
	const response = await api
		.post('/api/blogs')
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

afterAll(() => {
	mongoose.connection.close();
});
