const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const {
  SUCCESS, BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND, CONFLICT_REQUEST,
} = require('../errors/constants');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthhotizedError');

module.exports.getUsers = (req, res, next) => {
  userSchema
    .find({})
    .then((users) => res.status(SUCCESS).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  userSchema.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с таким id не найден'));
      }
      res.status(SUCCESS).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  if (!email || !password) {
    next(new ValidationError('Переданы некорректные данные'));
  }

  bcrypt.hash(password, 10)
    .then((hashPassword) => userSchema.create({
      name, about, avatar, email, password: hashPassword,
    }))
    .then((user) => res.status(SUCCESS).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else if (error.code === CONFLICT_REQUEST) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(error);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      res.status(SUCCESS).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      }
      next(error);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      res.status(SUCCESS).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
       next(new ValidationError('Переданы некорректные данные при обновлении аватара.'));
      }
      next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new ValidationError('Переданы некорректные данные'));
  }

  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильные почта или пароль'));
    })
    .catch(next);
};

module.exports.getUserProfile = (req, res, next) => {
  const { _id } = req.user;
  userSchema.findById(_id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.status(SUCCESS).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};
