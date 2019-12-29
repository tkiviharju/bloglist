/*eslint no-undef:*/
const listHelper = require('../utils/list_helper');
const { listWithOneBlog, listWithManyBlogs } = require('./mocks.js');

describe('favorite blog', () => {
	test('of empty list is null', () => {
		const result = listHelper.favoriteBlog([]);
		expect(result).toBe(null);
	});

	test('when list has one blog is that blog', () => {
		const result = listHelper.favoriteBlog(listWithOneBlog);
		expect(result).toEqual(listWithOneBlog[0]);
	});

	test('of a bigger list is the one with most likes', () => {
		const result = listHelper.favoriteBlog(listWithManyBlogs);
		expect(result).toEqual(listWithManyBlogs[2]);
	});
});

describe('total likes', () => {
	test('when list has one blog equals the likes of it', () => {
		const result = listHelper.totalLikes(listWithOneBlog);
		expect(result).toBe(5);
	});

	test('of a bigger list is calculated right', () => {
		const result = listHelper.totalLikes(listWithManyBlogs);
		expect(result).toBe(36);
	});

	test('of empty list is zero', () => {
		const result = listHelper.totalLikes([]);
		expect(result).toBe(0);
	});
});

describe('most blogs', () => {
	test('is null when list is empty', () => {
		const result = listHelper.mostBlogs([]);
		expect(result).toBe(null);
	});

	test('when list has one blog is the author of that', () => {
		const result = listHelper.mostBlogs(listWithOneBlog);
		const { author, blogs } = result;
		expect(author).toBe('Master of Everything');
		expect(blogs).toBe(1);
	});

	test('in a bigger list is calculated correctly', () => {
		const result = listHelper.mostBlogs(listWithManyBlogs);
		const { author, blogs } = result;
		expect(author).toBe('Robert C. Martin');
		expect(blogs).toBe(3);
	});
});


describe('most likes', () => {
	test('is null when list is empty', () => {
		const result = listHelper.mostLikes([]);
		expect(result).toBe(null);
	});

	test('when list has one blog is the like count of that blog', () => {
		const result = listHelper.mostLikes(listWithOneBlog);
		const { author, likes } = result;
		expect(author).toBe('Master of Everything');
		expect(likes).toBe(5);
	});

	test('in a bigger list is calculated correctly', () => {
		const result = listHelper.mostLikes(listWithManyBlogs);
		const { author, likes } = result;
		expect(author).toBe('Edsger W. Dijkstra');
		expect(likes).toBe(17);
	});
});