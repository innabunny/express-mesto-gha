const cardSchema = require('../models/card');
const {
  SUCCESS,
} = require('../errors/constants');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  cardSchema.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      } else if (!card.owner.equals(req.user._id)) {
        next(ForbiddenError('Вы не можете удалять карточки других пользователей'));
      } else {
        card.remove()
          .then((data) => {
            res.send({ data });
          })
          .catch(next);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Неккоректный _id карточки.'));
      } else {
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else {
        res.status(SUCCESS).send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
        return;
      }
      next(error);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else {
        res.status(SUCCESS).send({ card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
        return;
      }
      next(error);
    });
};
