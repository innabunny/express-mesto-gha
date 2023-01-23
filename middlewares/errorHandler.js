module.exports = (err, req, res, next) => {
  if (err.code === 11000) {
    res.status(409).send({ message: 'Такой пользователь уже существует' });
  }
  if (!err.statusCode) {
    next(err);
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: 'Ошибка сервера' });
};
