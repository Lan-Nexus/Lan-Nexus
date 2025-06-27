import fs from 'fs';
import logger from '../main/logger';

const log = logger('clearTemp');
const tempDir =  __dirname + '/../../temp';

export default async function clearTemp() {
    log.log('Clearing temp directory at ' + tempDir);
    fs.rmdirSync(tempDir, { recursive: true });
}
