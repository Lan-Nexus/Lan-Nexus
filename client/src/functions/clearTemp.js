import fs from 'fs';
import logger from '../main/logger';
import { app } from 'electron';
import path from 'path';

const log = logger('clearTemp');
let tempDir = app.getPath('temp');
tempDir = path.join(tempDir, 'Lan-Launcher');

export default async function clearTemp() {
    log.log('Clearing temp directory at ' + tempDir);
    fs.rmdirSync(tempDir, { recursive: true });
}
