import fs from 'fs';
import logger from '../main/logger';
import { FileLocation } from './utils';

const log = logger('clearTemp');
const tempDir = FileLocation.getTempDir();

export default async function clearTemp() {
    log.log('Clearing temp directory at ' + tempDir);
    fs.rmdirSync(tempDir, { recursive: true });
}
