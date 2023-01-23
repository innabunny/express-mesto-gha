const { celebrate, Joi } = require('celebrate');
const urlRegExp = /^https?:\/\/(www\.)?[a-zA-z\d-]+\.[a-z]{1,6}[\w\d\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

module.exports.validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegExp).required(),
  }),
});

module.exports.validationUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validationGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports.validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri({ scheme: ['http', 'https'] }),
  }),
});

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegExp),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});
