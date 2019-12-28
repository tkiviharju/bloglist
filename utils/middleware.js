const requestLogger = (req, res, next) => {
	const { method, path, body } = req;
	console.log(`${method} ${path} ${JSON.stringify(body)}`);
	console.log('---');
	next();
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
	console.error(error.message);

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return res.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message });
	}

	next(error);
};


module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler
};
