const logger = require('./logger.js');

const requestLogger = (req, res, next) => {
	const { method, path, body } = req;
	logger.info(`${method} ${path} ${JSON.stringify(body)}`);
	logger.info('---');
	return next();
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
	logger.error(error.message);

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return res.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return res.status(400).send({ error: error.message });
	} else if (['LoginError', 'TokenError', 'AuthorizationError'].includes(error.name)){
		return res.status(401).send({ error: error.message });
	} else if (error.name === 'JsonWebTokenError'){
		return res.status(401).json({ error: 'Invalid or missing authorization token' });
	}

	return next(error);
};

const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		req.token = authorization.substring(7);
	}
	next();
};



module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor
};
