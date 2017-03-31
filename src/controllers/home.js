import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('is Home22');
});

export default (app) => {
  app.use('/', router);
};
