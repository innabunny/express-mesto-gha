const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    res.status(409).send({ message: 'Такой пользователь уже существует' });
    return;
  }
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  } else {
    next(err);
  }
  res.status(500).send({ message: 'Ошибка сервера' });
};
module.exports = errorHandler;
