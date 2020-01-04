const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog.js');
const User = require('../models/user.js');
const { promiseHandler, getTokenFrom } = require('../utils/helpers.js');

blogsRouter.get('/', async (req, res, next) => {
	const [ blog, error ] =  await promiseHandler(Blog.find({}).populate('user', { username: 1, name: 1, _id: 1 }));
	return error ?
		next(error)
		:
		res.status(200).send(blog);

});

blogsRouter.post('/', async (req, res, next) => {
	const token = getTokenFrom(req);

	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.SECRET);
	} catch (error){
		return next(error);
	}

	if (!token || !decodedToken.id) {
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
	const { id } = req.params;
	const [ , error ] = await promiseHandler(Blog.findByIdAndDelete(id));
	return error ?
		next(error)
		:
		res.sendStatus(204);
});

module.exports = blogsRouter;
