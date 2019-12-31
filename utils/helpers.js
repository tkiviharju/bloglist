const bcrypt = require('bcrypt');

const createPasswordHash = async (password) => {
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	return passwordHash;
};

const promiseHandler = (promise) => (
	promise
		.then(data => ({ data, error: null }))
		.catch(error => ({ error, data: null }))
);



module.exports = { promiseHandler, createPasswordHash };