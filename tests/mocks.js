const listWithOneBlog = [
	{
		title: 'Exploding rabbits',
		author: 'Master of Everything',
		url: 'https://www.sickstuff.com/blog/1234',
		likes: 5,
	}
];

const blogWithNoTitleAndUrl = {
	author: 'Elon Musk'
};

const blogWithNoLikes = {
	title: 'Amazing blog post',
	author: 'Your uncle',
	url: 'https://www.yahoogle.com/blogs/3213'
};

const listWithManyBlogs = [
	{
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
	},
	{
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
	},
	{
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
	},
	{
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
	},
	{
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
	},
	{
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 2,
	}
];

const newUser = {
	username: 'mikromikko',
	name: 'Mikko Mikkonen',
	password: 'canonicalsecret'
};

module.exports = { listWithOneBlog, blogWithNoTitleAndUrl, blogWithNoLikes, listWithManyBlogs, newUser };