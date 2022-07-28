// require('dotenv').config()
const express = require('express');
const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blog');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const authorRouter = require('./controllers/author');
const readinglistRouter = require('./controllers/readinglist');
const logoutRouter = require('./controllers/logout');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/authors', authorRouter);
app.use('/api/readinglists', readinglistRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
