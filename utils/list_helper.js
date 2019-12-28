const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) =>
	blogs.reduce((previous, current) => previous + current.likes, 0);

const favoriteBlog = (blogs) =>
	blogs.reduce((previous, current) =>
		current.likes > previous.likes ? current : previous, { likes: -1 });

module.exports = { dummy, totalLikes, favoriteBlog };