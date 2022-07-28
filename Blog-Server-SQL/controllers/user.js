const userRouter = require('express').Router();

const { User, Blog, Token } = require('../models');

userRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });

  if (users) {
    res.json(users);
  } else {
    res.status(404).end();
  }
});

userRouter.get('/:id', async (req, res) => {
  const where = {};

  if (req.query.read) {
    if (req.query.read === 'true') {
      where.read = true;
    } else if (req.query.read === 'false') {
      where.read = false;
    }
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          where: where,
          attributes: { exclude: ['userId', 'blogId'] },
        },
        // include: {
        //   model: UserReadings,
        //   as: 'readinglists',
        //   attributes: {
        //     exclude: ['userId'],
        //   },
        // },
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

userRouter.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.put('/disable/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    user.disabled = req.body.disabled;
    await user.save();
    if (req.body.disabled === true) {
      const token = await Token.findOne({ where: { userId: user.id } });
      if (token) {
        await token.destroy();
      }
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
