import express from 'express';
import gamesController from '../Controllers/Games';

const router = express.Router();

router.post('/games', gamesController.create);
router.get('/games/:id', gamesController.read);
router.post('/games/:id', gamesController.update);
router.delete('/games/:id', gamesController.delete);
router.get('/games', gamesController.list);



export default router;
