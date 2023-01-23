const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    res.status(409).send({ message: 'Такой пользователь уже существует' });
    return;
  }
  if (!err.statusCode) {
    next(err);
  } else {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  res.status(500).send({ message: 'Ошибка сервера' });
};
module.exports = errorHandler;
