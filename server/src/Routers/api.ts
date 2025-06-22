import express from 'express';
import gamesController from '../Controllers/api/GamesApiController.js';
import steamController from '../Controllers/api/SteamApiController.js';
import GameKeyPageController from '../Controllers/api/GameKeyApiController.js';
import Router from './Router.js';

const router = express.Router();

new Router<gamesController>(router)
  .get('/games', gamesController, 'list')
  .get('/games/:id', gamesController, 'read')
  .post('/games', gamesController, 'create')
  .put('/games/:id', gamesController, 'update')
  .delete('/games/:id', gamesController, 'delete')

new Router<steamController>(router)
  .get('/steam', steamController, 'list')
  .get('/steam/:id', steamController, 'read')
  .post('/steam', steamController, 'create')

new Router<GameKeyPageController>(router)
  .post('/games/:gameId/keys', GameKeyPageController, 'create')
  .delete('/games/:gameId/keys/:id', GameKeyPageController, 'delete')
  .post('/games/:gameId/keys/:id/release', GameKeyPageController, 'release')
  .post('/games/:gameId/keys/:id/reserve', GameKeyPageController, 'reserve')
  .post('/games/:gameId/keys/reserve', GameKeyPageController, 'reserve')

export default router;
