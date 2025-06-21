import { promises as fs } from 'fs'
import path from 'path';

export default async function isGameInstalled(_progress, _active, gameName) {
  console.info('Checking if game is installed:', gameName);
  const gameDir = path.join(__dirname, '../../games', gameName);
  console.log(`Checking if game is installed at ${gameDir}`);

  return fs.access(gameDir).then(() => {
    console.log(`Game found at ${gameDir}`);
    return true;
  }).catch(err => {
    if (err.code === 'ENOENT') {
      console.log(`Game not found at ${gameDir}`);
    } else {
      console.error(`An error occurred while checking for ${gameDir}`, err);
    }
    return false;
  });
}
