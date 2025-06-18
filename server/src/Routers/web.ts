import express from 'express';
import GamesPageController from '../Controllers/GamesPageController.js';
import Router from './Router.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const imageFields = [
  { name: 'icon', maxCount: 1 },
  { name: 'headerImage', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'imageCard', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 }
];

new Router<GamesPageController>(router)
  // Only apply multer to POST and PUT routes that handle file uploads
  .post('/games/', GamesPageController, 'create', upload.fields(imageFields))
  .put('/games/:id', GamesPageController, 'update', upload.fields(imageFields))
  .get('/games/', GamesPageController, 'list')
  .get('/games/create', GamesPageController, 'renderCreateForm')
  .get('/games/:id', GamesPageController, 'read')
  .get('/games/:id/edit', GamesPageController, 'renderUpdateForm')
  .delete('/games/:id', GamesPageController, 'delete');
  
export default router;
