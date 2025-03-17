import path from 'path';
import fs from 'fs';

export default async (progressCallback, gameName) => {

  progressCallback(0);

  let gameDir = path.join(__dirname, '../../games');

  gameDir = path.join(gameDir, gameName);

  console.log('Removing ' + gameDir);

  fs.rmdirSync(gameDir, { recursive: true });

  progressCallback(100);

}
