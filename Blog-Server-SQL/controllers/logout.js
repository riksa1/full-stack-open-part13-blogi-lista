const logoutRouter = require('express').Router();

const { Token } = require('../models');
const { tokenExtractor } = require('../utils/middleware');

logoutRouter.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    const token = await Token.findOne({
      where: { userId: req.decodedToken.id },
    });
    await token.destroy();
    const stuff = await Token.findAll({
      where: { userId: req.decodedToken.id },
    });
    console.log(stuff, 'hmmm this is stuff');
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = logoutRouter;
