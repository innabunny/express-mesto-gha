const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateUserProfile, updateAvatar, getUserProfile,
} = require('../controllers/users');
// const { validationUpdateAvatar, validationUpdateProfile, validationGetUserById } =
// require('../middlewares/validation');

userRouter.get('/users', getUsers);
userRouter.get('users/me', celebrate({
  params: {
    userId: Joi.string().regex(/^[a-z0-9]{24}$/i),
  },
}), getUserProfile);
userRouter.get('users/:userId', celebrate({
  params: {
    userId: Joi.string().regex(/^[a-z0-9]{24}$/i),
  },
}), getUserById);
userRouter.patch('users/me', celebrate({
  params: {
    userId: Joi.string().regex(/^[a-z0-9]{24}$/i),
  },
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);
userRouter.patch('users/me/avatar', celebrate({
  params: {
    userId: Joi.string().regex(/^[a-z0-9]{24}$/i),
  },
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^https?:\/\//i),
  }),
}), updateAvatar);

module.exports = userRouter;
