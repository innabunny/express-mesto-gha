const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthhotizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};
