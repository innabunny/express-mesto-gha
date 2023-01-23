const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthhotizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith('Bearer ')) {
    next(new UnauthorizedError('необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError('необходима авторизация'));
  }

  req.user = payload;
  next();
};
