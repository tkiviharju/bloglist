const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) =>
	blogs.reduce((previous, current) => previous + current.likes, 0);

const favoriteBlog = (blogs) => {
	return blogs.length ?
		blogs.reduce((previous, current) =>
			current.likes > previous.likes ? current : previous, { likes: -1 })
		:
		null;
};

const mostBlogs = (blogs) => {
	if (!blogs.length) return null;

	const authors = blogs.reduce((previous, current) => {
		const currentAuthor = previous.find(author => author.author === current.author);
		if (currentAuthor){
			currentAuthor.blogs++;
			return previous;
		}
		return previous.concat({ author: current.author, blogs: 1 });
	}, []);

	return authors.reduce((previous, current) => current.blogs > previous.blogs ? current : previous, { blogs: -1 });
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };