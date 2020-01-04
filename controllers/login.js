const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const { promiseHandler } = require('../utils/helpers.js');

loginRouter.post('/', async (req, res, next) => {
	const { username, password } = req.body;

	const [ user, userError ]  = await promiseHandler(User.findOne({ username }));
	const passwordCorrect = (userError || user === null) ?
		false
		:
		await bcrypt.compare(password, user.passwordHash);

	if (!(user && passwordCorrect)){
		const error = {
			name: 'LoginError',
			message: 'invalid username or password'
		};
		return next(error);
	}

	const userForToken = {
		username: user.username,
		id: user._id
	};

	const token = jwt.sign(userForToken, process.env.SECRET);

	return res.status(200).send({ token, user: user.username, name: user.name });

});

module.exports = loginRouter;
