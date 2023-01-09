const userSchema = require('../models/user.js');
const { SUCCESS, BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND } = require('../utils/constants.js')

module.exports.getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => res.status(SUCCESS).send(users))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутрення ошибка сервера'});
    })
}

module.exports.getUserById = (req, res) => {
  userSchema.findById(req.params.userId)
    .then((user) => {
      if(!user) {
        res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден'});
        return
      }
      res.status(SUCCESS).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      });
    })
    .catch((error) => {
      if(error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя'});
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутрення ошибка сервера'})
    })
}

module.exports.createUser = (req, res) =>{
  const { name, about, avatar} = req.body;
  userSchema.create({ name, about, avatar })
    .then((user) =>
      res.status(CREATED).send({
      data: user
    }))
    .catch(error => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({message: 'Переданы некорректные данные при создании пользователя'});
        return
      }
      res.status(INTERNAL_SERVER_ERROR).send({message: 'Внутрення ошибка сервера'});
    })
}

module.exports.updateUserProfile = (req, res) => {
  const { name, about} =req.body;
  userSchema.findByIdAndUpdate(
    req.user._id, {name, about},
    {new: true, runValidators: true},
  )
    .then((user) => {
      if(!user) {
        res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден'});
        return
      }
      res.status(SUCCESS).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      })
    })
    .catch((error) => {
      if(error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля'});
        return
      }
      res.status(INTERNAL_SERVER_ERROR).send({message: 'Внутренняя ошибка сервера' });
    })
}

module.exports.updateAvatar = (req, res) => {
  const { avatar} =req.body;
  userSchema.findByIdAndUpdate(
    req.user._id, {avatar},
    {new: true, runValidators: true},
  )
    .then((user) => {
      if(!user) {
        res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден'});
        return
      }
      res.status(SUCCESS).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      })
    })
    .catch((error) => {
      if(error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.'});
        return
      }
      res.status(INTERNAL_SERVER_ERROR).send({message: 'Внутренняя ошибка сервера' });
    })
}
