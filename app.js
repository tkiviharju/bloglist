const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require('./utils/logger');
const { requestLogger, unknownEndpoint, errorHandler, tokenExtractor } = require('./utils/middleware.js');
const { MONGODB_URI } = require('./utils/config.js');
const blogsRouter = require('./controllers/blogs.js');
const usersRouter = require('./controllers/users.js');
const loginRouter = require('./controllers/login.js');

logger.info('Connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => logger.info('Connected to MongoDB'))
	.catch((error) => logger.error('Error with connecting to MongoDB', error.message));


app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);
app.use(tokenExtractor);


app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;