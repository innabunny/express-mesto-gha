const cardRouter = require('express').Router();
const { getCards, createCard, deleteCard, dislikeCard, likeCard} = require('../controllers/cards.js');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter