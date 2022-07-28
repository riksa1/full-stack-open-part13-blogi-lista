const blogRouter = require('express').Router();

const { Blog, User } = require('../models');
const { Op } = require('sequelize');
const { tokenExtractor } = require('../utils/middleware');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id, {
    include: { model: User, attributes: ['username'] },
  });
  next();
};

blogRouter.get('/', async (req, res, next) => {
  try {
    var where = {};

    if (req.query.search) {
      where = {
        [Op.or]: [
          {
            title: {
              [Op.substring]: req.query.search,
            },
          },
          {
            author: {
              [Op.substring]: req.query.search,
            },
          },
        ],
      };
    }

    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name', 'username'],
      },
      order: [['likes', 'DESC']],
      where: where,
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id });
    return res.json({
      likes: blog.likes,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      id: blog.id,
      user: { username: user.username, name: user.name },
      year: blog.year,
    });
  } catch (error) {
    next(error);
  }
});

blogRouter.delete(
  '/:id',
  tokenExtractor,
  blogFinder,
  async (req, res, next) => {
    try {
      if (req.decodedToken.id === req.blog.userId) {
        await req.blog.destroy();
        res.status(204).end();
      } else {
        return res.status(401).json({ error: 'unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }
);

blogRouter.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
