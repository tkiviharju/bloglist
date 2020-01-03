const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');
const User = require('../models/user.js');
const { promiseHandler } = require('../utils/helpers.js');

blogsRouter.get('/', async (req, res, next) => {
	const [ blog, error ] =  await promiseHandler(Blog.find({}).populate('user', { username: 1, name: 1, _id: 1 }));
	return error ?
		next(error)
		:
		res.status(200).send(blog);

});

blogsRouter.post('/', async (req, res, next) => {
	const [ user, userFindError ] = await promiseHandler(User.findOne({}));
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
