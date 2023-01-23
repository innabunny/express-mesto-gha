const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateUserProfile, updateAvatar, getUserProfile,
} = require('../controllers/users');
const { validationUpdateAvatar, validationUpdateProfile, validationGetUserById } = require('../middlewares/validation');

userRouter.get('/users', getUsers);
userRouter.get('users/me', getUserProfile);
userRouter.get('users/:userId', validationGetUserById, getUserById);
userRouter.patch('users/me', validationUpdateProfile, updateUserProfile);
userRouter.patch('users/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = userRouter;
