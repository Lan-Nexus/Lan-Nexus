import path from 'path';
import fs from 'fs';
import { FileLocation, progressCallback } from './utils.js'
export default async (gameName) => {

  if (!gameName) {
    throw new Error('Game name is required to remove a game.');
  }

  progressCallback(0);

  const gameDir = path.join(FileLocation.getGameDir(), gameName);

  console.log('Removing ' + gameDir);

  fs.rmdirSync(gameDir, { recursive: true });

  progressCallback(100);

}
