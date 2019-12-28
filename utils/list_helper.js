const dummy = (blogs) => {
	return 1;
};

const returnHighestValueObject = (list, attribute) => list.reduce((previous, current) => current[attribute] > previous[attribute] ? current : previous, { [attribute]: -1 });

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

	return returnHighestValueObject(authors, 'blogs');
};

const mostLikes = (blogs) => {
	if (!blogs.length) return null;

	const authors = blogs.reduce((previous, current) => {
		const currentAuthor = previous.find(author => author.author === current.author);
		if (currentAuthor){
			currentAuthor.likes += current.likes;
			return previous;
		}
		return previous.concat({ author: current.author, likes: current.likes });
	}, []);

	return returnHighestValueObject(authors, 'likes');
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };