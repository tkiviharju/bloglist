const bcrypt = require('bcrypt');

const createPasswordHash = async (password) => {
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	return passwordHash;
};

const promiseHandler = (promise) => (
	promise
		.then(data => ([ data, null ]))
		.catch(error => ([ null, error ]))
);

const getTokenFrom = (request) => {
	const authorization = request.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7);
	}
	return null;
};



module.exports = { promiseHandler, createPasswordHash, getTokenFrom };