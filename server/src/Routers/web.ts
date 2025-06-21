import express from 'express';
import GamesPageController from '../Controllers/GamesPageController.js';
import SteamPagesController from '../Controllers/SteamPagesController.js';
import Router from './Router.js';
import multer from 'multer';
import GameKeyPageController from '../Controllers/GameKeyPageController.js';
import GameModel from '../Models/Game.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const imageFields = [
  { name: 'icon', maxCount: 1 },
  { name: 'headerImage', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'imageCard', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 }
];

const archiveFields = [
  ...imageFields,
  { name: 'archives', maxCount: 1 }
];

new Router<GamesPageController>(router)
  .post('/games/', GamesPageController, 'create', upload.fields(archiveFields))
  .put('/games/:id', GamesPageController, 'update', upload.fields(archiveFields))
  .get('/games/', GamesPageController, 'list')
  .get('/games/create', GamesPageController, 'renderCreateForm')
  .get('/games/:id', GamesPageController, 'read')
  .get('/games/:id/edit', GamesPageController, 'renderUpdateForm')
  .delete('/games/:id', GamesPageController, 'delete');

new Router<SteamPagesController>(router)
  .get('/steam', SteamPagesController, 'list');

// Game Keys routes (web views)
new Router<GameKeyPageController>(router)
  .get('/games/:gameId/keys', GameKeyPageController, 'list')
  .get('/games/:gameId/keys/new', GameKeyPageController, 'renderCreateForm')
  .post('/games/:gameId/keys', GameKeyPageController, 'create')
  .get('/games/:gameId/keys/:id/edit', GameKeyPageController, 'renderUpdateForm')
  .put('/games/:gameId/keys/:id', GameKeyPageController, 'update')
  .delete('/games/:gameId/keys/:id', GameKeyPageController, 'delete');

export default router;
