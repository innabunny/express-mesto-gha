const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith('Bearer ')) {
    res.status(401).send({ message: 'необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
