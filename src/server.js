import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routers from './controllers';
import { port } from './config';

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routers.forEach((controller) => {
  controller(app);
});

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
  console.log(`The server is running at http://localhost:${port}/`);
});
