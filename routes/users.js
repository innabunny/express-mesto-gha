const userRouter = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUserProfile, updateAvatar, getUserProfile,
} = require('../controllers/users');
const { validationUpdateAvatar, validationUpdateProfile, validationGetUserById, } = require('../middlewares/validation');

userRouter.get('/', getUsers);
userRouter.get('/:userId', validationGetUserById, getUserById);
// userRouter.post('/', createUser);
userRouter.get('/me', getUserProfile);
userRouter.patch('/me', validationUpdateProfile, updateUserProfile);
userRouter.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = userRouter;
