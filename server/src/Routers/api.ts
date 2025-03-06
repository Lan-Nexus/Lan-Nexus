import express from 'express';
import gamesController from '../Controllers/Games.js';
import steamController from '../Controllers/Steam.js';
import Router from './Router.js';

const router = express.Router();

new Router<gamesController>(router)
  .get('/games', gamesController, 'list')
  .get('/games/:id', gamesController, 'read')
  .post('/games', gamesController, 'create')
  .put('/games/:id', gamesController, 'update')
  .delete('/games/:id', gamesController, 'delete');

new Router<steamController>(router)
  .get('/steam', steamController, 'list')
  .get('/steam/:id', steamController, 'read')
  .post('/steam', steamController, 'create')

export default router;
