const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const {
  SUCCESS, CONFLICT_REQUEST,
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
  const {
    name, about, avatar, email, password,
  } = req.body;
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
    throw new UnauthorizedError('Неправильные email или пароль');
  }

  userSchema.findOne({ email }).select('+password')
    .orFail(new UnauthorizedError('Неправильные email или пароль'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные email или пароль');
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.status(SUCCESS).cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            sameSite: true,
            httpOnly: true,
          }).send({ message: 'Успешная регистрация' });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getUserProfile = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.status(SUCCESS).send({ data: user });
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
