const User = require('../models/user.js');

const usersInDb = async () => {
	const users = await User.find({});
	return users.map(user => user.toJSON());
};

module.exports = {
	usersInDb
};
