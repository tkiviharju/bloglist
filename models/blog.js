const mongoose = require('mongoose');
const { MONGODB_URI } = require('../utils/config.js');

const blogSchema = mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	url: { type: String, required: true },
	likes: { type: Number, required: true },
});

const Blog = mongoose.model('Blog', blogSchema);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = Blog;