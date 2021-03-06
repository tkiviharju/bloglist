const usersRouter = require('express').Router();
const User = require('../models/user.js');
const { promiseHandler, createPasswordHash }  = require('../utils/helpers.js');

usersRouter.get('/', async (req, res, next) => {
	const [ data, error ] =  await promiseHandler(User.find({}).populate('blogs', { url: 1, title: 1, author: 1, _id: 1 }));
	return error ?
		next(error)
		:
		res.status(200).send(data);

});


usersRouter.post('/', async (req, res, next) => {
	const { username, name, password } = req.body;

	if (!password || password.length < 3){
		const error = {
			message: 'Password is missing or shorter than minimum allowed length (3)',
			name: 'ValidationError'
		};
		return next(error);
	}
	const passwordHash = await createPasswordHash(password);
	const newUser = new User({
		username,
		name,
		passwordHash,
	});

	const [ data, error ] = await promiseHandler(newUser.save());
	return error ?
		next(error)
		:
		res.status(201).send(data);
});

// usersRouter.delete('/:id', async (req, res, next) => {
// 	const { id } = req.params;
// 	const { error } = await promiseHandler(User.findByIdAndDelete(id));
// 	return error ?
// 		next(error)
// 		:
// 		res.sendStatus(204);
// });

module.exports = usersRouter;
