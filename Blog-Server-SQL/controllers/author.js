const authorRouter = require('express').Router();

const { User, Blog } = require('../models');
const sequelize = require('sequelize');

authorRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('sum', sequelize.col('likes')), 'likes'],
        [sequelize.fn('count', sequelize.col('author')), 'blogs'],
      ],
      order: [[sequelize.fn('sum', sequelize.col('likes')), 'DESC']],
      group: ['author'],
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

module.exports = authorRouter;
