/* eslint-disable @typescript-eslint/explicit-function-return-type */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, '../../temp');

export default async function download(progressCallback, progressActive, url, filename) {

  progressCallback(0, 'Downloading');

  console.log('Downloading ' + url + ' to ' + path.join(tempDir, filename));
  const subDir = path.join(tempDir, filename.split('/').slice(0, -1).join('/'));

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true });
  }

  const headResponse = await axios.head(url);
  const totalLength = parseInt(headResponse.headers['content-length'], 10) || 0;

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    onDownloadProgress: (progressEvent) => {
      if (totalLength && progressCallback) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / totalLength);
        progressCallback(percentCompleted, 'Downloading');
      }
    },
  });

  fs.writeFileSync(path.join(tempDir, filename), response.data);
}

