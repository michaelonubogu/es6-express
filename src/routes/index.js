import { list as articleList } from '../controllers/article';

export default (app) => {
  app.get('/', articleList);
};
