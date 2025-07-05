import express from 'express';
import gamesController from '../Controllers/api/GamesApiController.js';
import gamesSearchController from '../Controllers/api/GameSearchApiController.js';
import steamController from '../Controllers/api/SteamApiController.js';
import GameKeyPageController from '../Controllers/api/GameKeyApiController.js';
import Router from './Router.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { jwtAuth } from '../jwt.js';

const router = express.Router();
router.use(jwtAuth as express.RequestHandler);

const upload = multer({ storage: multer.memoryStorage() });

const fileUploadFields = [
  { name: 'icon', maxCount: 1 },
  { name: 'headerImage', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'imageCard', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'archives', maxCount: 1 }
];

const archiveFields = [
  ...fileUploadFields,
];


new Router<gamesController>(router)
  .Permissions({
    list: 'games:list',
    read: 'games:read',
    create: 'games:create',
    update: 'games:update',
    delete: 'games:delete'
  })
  .get('/games', gamesController, 'list')
  .get('/games/:id', gamesController, 'read')
  .post('/games', gamesController, 'create', upload.fields(archiveFields))
  .put('/games/:id', gamesController, 'update', upload.fields(archiveFields))
  .delete('/games/:id', gamesController, 'delete')

new Router<gamesSearchController>(router)
  .get('/games/search/:id', gamesSearchController, 'read')
  .get('/games/search', gamesSearchController, 'list')
  .post('/games/search', gamesSearchController, 'search')
  .post('/search/create', gamesSearchController, 'create')

new Router<steamController>(router)
  .get('/steam', steamController, 'list')
  .get('/steam/:id', steamController, 'read')
  .post('/steam', steamController, 'create')

new Router<GameKeyPageController>(router)
  .get('/games/:gameId/keys', GameKeyPageController, 'list')
  .post('/games/:gameId/keys', GameKeyPageController, 'create')
  .delete('/games/:gameId/keys/:id', GameKeyPageController, 'delete')
  .post('/games/:gameId/keys/:id/release', GameKeyPageController, 'release')
  .post('/games/:gameId/keys/:id/reserve', GameKeyPageController, 'reserve')
  .post('/games/:gameId/keys/reserve', GameKeyPageController, 'reserve')

export default router;
