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


module.exports = { promiseHandler, createPasswordHash };