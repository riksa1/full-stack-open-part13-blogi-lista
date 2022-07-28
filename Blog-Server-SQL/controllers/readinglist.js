const readinglistRouter = require('express').Router();
const UserReadings = require('../models/user_readings');

readinglistRouter.post('/', async (req, res, next) => {
  try {
    const userReadings = await UserReadings.create({
      userId: req.body.user_id,
      blogId: req.body.blog_id,
    });
    res.json(userReadings);
  } catch (error) {
    next(error);
  }
});

readinglistRouter.put('/:id', async (req, res, next) => {
  try {
    const list = await UserReadings.findByPk(req.params.id);
    list.read = req.body.read;
    await list.save();
    res.json(list);
  } catch (error) {
    next(error);
  }
});

module.exports = readinglistRouter;
