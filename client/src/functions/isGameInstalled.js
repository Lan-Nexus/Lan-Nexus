import { promises as fs } from 'fs'
import path from 'path';
import logger from '../main/logger';
import { FileLocation } from './utils';


const log = logger('isGameInstalled');

export default async function isGameInstalled(gameName) {
  log.info('Checking if game is installed:', gameName);
  const gameDir = path.join(FileLocation.getGameDir(), gameName);

  log.log(`Checking if game is installed at ${gameDir}`);

  return fs.access(gameDir).then(() => {
    log.log(`Game found at ${gameDir}`);
    return true;
  }).catch(err => {
    if (err.code === 'ENOENT') {
      log.log(`Game not found at ${gameDir}`);
    } else {
      log.error(`An error occurred while checking for ${gameDir}`, err);
    }
    return false;
  });
}
