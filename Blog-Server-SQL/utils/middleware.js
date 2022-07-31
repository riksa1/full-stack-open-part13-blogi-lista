const jwt = require('jsonwebtoken');
const { Token, User } = require('../models');
const { SECRET } = require('../utils/config');

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.log(error.name);

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).send({ error: 'Wrong type used' });
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: error.message });
  } else if (error.name === 'SequelizeHostNotFoundError') {
    return response
      .status(400)
      .send({ error: 'Error could not find object from database' });
  } else if (error.name === 'TypeError') {
    return response
      .status(400)
      .send({ error: 'Could not set value for null object' });
  } else if (error.name === 'SyntaxError') {
    return response.status(400).send({ error: 'Syntax Error' });
  }

  next(error);
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET);
      const token = await Token.findOne({
        where: { userId: decodedToken.id, token: authorization.substring(7) },
      });
      const user = await User.findByPk(decodedToken.id);
      if (token && user.disabled === false) {
        req.decodedToken = decodedToken;
      } else if (user.disabled === true) {
        return res.status(401).send({ error: 'User is disabled' });
      } else {
        return res.status(401).json({ error: 'token invalid' });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
