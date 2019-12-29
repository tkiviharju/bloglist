const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');
const promiseHandler = require('../utils/promiseHandler.js');

blogsRouter.get('/', async (req, res, next) => {
	const { data, error } =  await promiseHandler(Blog.find({}));
	return error ?
		next(error)
		:
		res.status(200).send(data);

});

blogsRouter.post('/', async (req, res, next) => {
	const newBlog = new Blog(req.body);
	const { data, error } = await promiseHandler(newBlog.save());
	return error ?
		next(error)
		:
		res.status(201).send(data);
});

blogsRouter.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	const { error } = await promiseHandler(Blog.findByIdAndDelete(id));
	return error ?
		next(error)
		:
		res.sendStatus(204);
});

module.exports = blogsRouter;
