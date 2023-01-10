const cardSchema = require('../models/card');
const {
  SUCCESS, BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  cardSchema.find({})
    .then((cards) => {
      res.status(SUCCESS).send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутрення ошибка сервера' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED).send({
        data: card,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  cardSchema.findByIdAndRemove(req.params.cardId)
    .select(['-createdAt'])
    .then((card) => {
      if (!card) {
        res.status(PAGE_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(SUCCESS).send({
        data: card,
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неккоректный _id карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.cardId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(PAGE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(SUCCESS).send({
        data: card,
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.cardId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(PAGE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(SUCCESS).send({
        data: card,
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};
