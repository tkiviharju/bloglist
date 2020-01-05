const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog.js');
const User = require('../models/user.js');
const { promiseHandler } = require('../utils/helpers.js');

blogsRouter.get('/', async (req, res, next) => {
	const [ blogs, error ] = await promiseHandler(Blog.find({}).populate('user', { username: 1, name: 1, _id: 1 }));
	return error ?
		next(error)
		:
		res.status(200).send(blogs);

});


blogsRouter.get('/:id', async (req, res, next) => {
	const { id } = req.params;
	const [ blog, error ] = await promiseHandler(Blog.findById(id).populate('user', { username: 1, name: 1, _id: 1 }));
	return error ?
		next(error)
		:
		res.status(200).send(blog);
});


blogsRouter.post('/', async (req, res, next) => {
	let decodedToken;
	try {
		decodedToken = jwt.verify(req.token, process.env.SECRET);
	} catch (error){
		return next(error);
	}

	if (!req.token || !decodedToken.id) {
		const error = {
			name: 'TokenError',
			message: 'token missing or invalid'
		};
		return next(error);
	}

	const [ user, userFindError ] = await promiseHandler(User.findById(decodedToken.id));
	if (userFindError)
		return next(userFindError);

	const newBlog = new Blog(req.body);
	newBlog.user = user._id;

	const [ savedBlog, blogError ] = await promiseHandler(newBlog.save());
	if (blogError)
		return next(blogError);

	user.blogs = (user.blogs || []).concat(savedBlog._id);
	const [ , userSaveError ] = await promiseHandler(user.save());
	return userSaveError ?
		next(userSaveError)
		:
		res.status(201).send(savedBlog);
});


blogsRouter.delete('/:id', async (req, res, next) => {
	let decodedToken;
	try {
		decodedToken = jwt.verify(req.token, process.env.SECRET);
	} catch (error){
		return next(error);
	}

	if (!req.token || !decodedToken.id) {
		const error = {
			name: 'TokenError',
			message: 'token missing or invalid'
		};
		return next(error);
	}

	const { id } = req.params;

	const [ blog, blogFindError ] = await promiseHandler(Blog.findById(id));
	if (blogFindError)
		return next(blogFindError);

	const { user } = blog;
	if (user.toString() !== decodedToken.id.toString()){
		const error = {
			name: 'AuthorizationError',
			message: 'Not authorized to perform delete operation'
		};
		return next(error);
	}

	const [ , deleteError ] = await promiseHandler(Blog.findByIdAndDelete(id));
	return deleteError ?
		next(deleteError)
		:
		res.sendStatus(204);
});


module.exports = blogsRouter;
