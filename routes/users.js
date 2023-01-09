const userRouter = require('express').Router();
const { getUsers, getUserById, createUser, updateUserProfile, updateAvatar } = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;