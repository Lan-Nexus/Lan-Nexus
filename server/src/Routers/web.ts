import express from 'express';
import GamesPageController from '../Controllers/GamesPageController.js';
import Router from './Router.js';

const router = express.Router();

new Router<GamesPageController>(router)
  .get('/games/', GamesPageController, 'list')
  .get('/games/create', GamesPageController, 'renderCreateForm')
  .post('/games/', GamesPageController, 'create')
  .get('/games/:id', GamesPageController, 'read')
  .get('/games/:id/edit', GamesPageController, 'renderUpdateForm')
  .put('/games/:id', GamesPageController, 'update')
  .delete('/games/:id', GamesPageController, 'delete');
  
export default router;
