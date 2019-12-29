const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	url: { type: String, required: true },
	likes: { type: Number, default: 0 },
});

blogSchema.set('toJSON', {
	transform: (doc, obj) => {
		obj.id = obj._id.toString();
		delete obj._id;
		delete obj.__v;
	}
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;