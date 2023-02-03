const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');
const { validationCreateUser, validationLogin } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/card'));

app.use((req, res, next) => {
  next(new NotFoundError('запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
