import express from 'express';
import GamesPageController from '../Controllers/pages/GamesPageController.js';
import SteamPagesController from '../Controllers/pages/SteamPageController.js';
import SearchGameController from '../Controllers/pages/SearchGameController.js';
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

new Router<GamesPageController>(router)
  .post('/games/', GamesPageController, 'create', upload.fields(archiveFields))
  .put('/games/:id', GamesPageController, 'update', upload.fields(archiveFields))
  .get('/games/', GamesPageController, 'list')
  .get('/games/create', GamesPageController, 'renderCreateForm')
  .get('/games/:id', GamesPageController, 'read')
  .get('/games/:id/edit', GamesPageController, 'renderUpdateForm')
  .delete('/games/:id', GamesPageController, 'delete')
  .post('/games/upload-archive', GamesPageController, 'uploadArchive', uploadArchive.single('file'));

new Router<SteamPagesController>(router)
  .get('/steam', SteamPagesController, 'list');

new Router<SearchGameController>(router)
  .get('/search', SearchGameController, 'list')
  .get('/search/:id', SearchGameController, 'read')

// Game Keys routes (web views)

export default router;
