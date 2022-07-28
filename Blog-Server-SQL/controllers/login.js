const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();

const { SECRET } = require('../utils/config');
const User = require('../models/user');
const { Token } = require('../models');

loginRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body;

    const user = await User.findOne({
      where: {
        username: body.username,
      },
    });

    const passwordCorrect = body.password === 'salainen';

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password',
      });
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    if (user.disabled) {
      return res.status(401).json({
        error: 'user is disabled',
      });
    } else {
      const token = jwt.sign(userForToken, SECRET);
      await Token.create({ token, userId: user.id });
      res.status(200).send({ token, username: user.username, name: user.name });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
