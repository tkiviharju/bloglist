const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: { type: String, required: true, minlength: 3 },
	name: { type: String, required: true },
	passwordHash: { type: String, required: true },
	blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', default: [] }]
});

userSchema.set('toJSON', {
	transform: (doc, obj) => {
		obj.id = obj._id.toString();
		delete obj._id;
		delete obj.__v;
		delete obj.passwordHash;
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;