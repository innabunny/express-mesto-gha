const { celebrate, Joi } = require('celebrate');
const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, dislikeCard, likeCard,
} = require('../controllers/cards');
// const { validationCreateCard, validationCardId } = require('../middlewares/validation');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\//i),
  }),
}), createCard);
cardRouter.delete('cards/:cardId', celebrate({
  params: {
    cardId: Joi.string().regex(/^[a-z0-9]{24}$/i),
  },
}), deleteCard);
cardRouter.put('cards/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().regex(/^[a-z0-9]{24}$/i),
  },
}), likeCard);
cardRouter.delete('cards/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().regex(/^[a-z0-9]{24}$/i),
  },
}), dislikeCard);

module.exports = cardRouter;
