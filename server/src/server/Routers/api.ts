import express from 'express';
import gamesController from '../Controllers/api/GamesApiController.js';
import gamesSearchController from '../Controllers/api/GameSearchApiController.js';
import steamController from '../Controllers/api/SteamApiController.js';
import GameKeyPageController from '../Controllers/api/GameKeyApiController.js';
import Router from './Router.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Use disk storage for archive uploads
const archiveStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const archiveDir = path.join(process.cwd(), 'public', 'games', 'archives');
    fs.mkdirSync(archiveDir, { recursive: true });
    cb(null, archiveDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.zip';
    const fileName = `archive-${Date.now()}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: multer.memoryStorage() }); // for images
const uploadArchive = multer({ storage: archiveStorage }); // for archives

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


new Router<gamesController>(router)
  .get('/games', gamesController, 'list')
  .get('/games/:id', gamesController, 'read')
  .post('/games', gamesController, 'create', upload.fields(archiveFields))
  .put('/games/:id', gamesController, 'update')
  .delete('/games/:id', gamesController, 'delete')

new Router<gamesSearchController>(router)
  .get('/games/search', gamesSearchController, 'list')
  .post('/games/search', gamesSearchController, 'search')
  .post('/search/create', gamesSearchController, 'create')

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
