/* eslint-disable @typescript-eslint/explicit-function-return-type */
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import logger from '../main/logger';

const log = logger('download');
const tempDir = FileLocation.getTempDir();

import { FileLocation, progressCallback } from './utils.js'

export default async function download(url, filename) {
  progressCallback(0, 'Downloading');
  log.log('Downloading ' + url + ' to ' + path.join(tempDir, filename));
  const subDir = path.join(tempDir, filename.split('/').slice(0, -1).join('/'));

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true });
  }

  const headResponse = await axios.head(url);
  const totalLength = parseInt(headResponse.headers['content-length'], 10) || 0;

  const response = await axios.get(url, { responseType: 'stream' });
  const filePath = path.join(tempDir, filename);
  const writer = fs.createWriteStream(filePath);

  let downloaded = 0;
  response.data.on('data', (chunk) => {
    downloaded += chunk.length;
    if (totalLength && progressCallback) {
      const percentCompleted = Math.round((downloaded * 100) / totalLength);
      progressCallback(percentCompleted, 'Downloading');
    }
  });

  await new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
