const logoutRouter = require('express').Router();

const { Token } = require('../models');
const { tokenExtractor } = require('../utils/middleware');

logoutRouter.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    const token = await Token.findOne({
      where: { userId: req.decodedToken.id },
    });
    await token.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = logoutRouter;
