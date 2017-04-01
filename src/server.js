import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import logger from 'morgan';
// import glob from 'glob';
import Promise from 'bluebird';
import routers from './routes';
import { port, db } from './config';

// Use bluebird
const options = { promiseLibrary: Promise };

mongoose.connect(db, options);

const dbConn = mongoose.connection;
dbConn.on('error', () => {
  throw new Error(`unable to connect to database at: ${db}`);
});

const env = process.env.NODE_ENV || 'development';


const app = express();

app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('./public'));

routers(app);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error',
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error',
  });
});

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`); // eslint-disable-line
});
