const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, dislikeCard, likeCard,
} = require('../controllers/cards');
const { validationCreateCard, validationCardId } = require('../middlewares/validation');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', validationCreateCard, createCard);
cardRouter.delete('cards/:cardId', validationCardId, deleteCard);
cardRouter.put('cards/:cardId/likes', validationCardId, likeCard);
cardRouter.delete('cards/:cardId/likes', validationCardId, dislikeCard);

module.exports = cardRouter;
