const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware.js');
const blogsRouter = require('./controllers/blogs.js');

app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);


app.use('/api/blogs', blogsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;