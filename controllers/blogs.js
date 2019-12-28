const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');

blogsRouter.get('/', (req, res, next) => {
	Blog.find({})
		.then(blogs => res.status(200).send(blogs))
		.catch(error => next(error));
});

blogsRouter.post('/', (req, res, next) => {
	const blog = new Blog(req.body);

	blog.save()
		.then(result => res.status(201).json(result))
		.catch(error => next(error));
});


module.exports = blogsRouter;
