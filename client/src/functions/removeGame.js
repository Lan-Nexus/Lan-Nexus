import path from 'path';
import fs from 'fs';
import { progressCallback } from './utils.js'
import { app } from 'electron';
export default async (gameName) => {

  if (!gameName) {
    throw new Error('Game name is required to remove a game.');
  }

  progressCallback(0);

  const gameDir = path.join(app.getAppPath(), 'games', gameName);

  console.log('Removing ' + gameDir);

  fs.rmdirSync(gameDir, { recursive: true });

  progressCallback(100);

}
