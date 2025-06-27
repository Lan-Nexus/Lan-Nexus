import yauzl from 'yauzl';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import logger from '../main/logger';
import { progressCallback} from './utils.js'

const log = logger('unzip');

export default async function unzip(filename, gameName) {
  const tempDir = path.join(__dirname, '../../temp');
  const gameDir = path.join(__dirname, '../../games', gameName);

  log.log(`Unzipping ${path.join(tempDir, filename)} for ${gameName}`);
  log.log(`Extracting to ${gameDir}`);

  // Use yauzl.open to stream the zip file instead of reading into memory
  const zipPath = path.join(tempDir, filename);

  // Get an approximate entry count first to track progress
  const totalEntries = await new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      let count = 0;
      zipfile.on('entry', () => {
        count++;
        zipfile.readEntry();
      });
      zipfile.on('end', () => resolve(count));
      zipfile.on('error', reject);
      zipfile.readEntry();
    });
  });

  // Now open the zip file again for actual extraction
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      const entries = [];
      let processedEntries = 0;
      progressCallback(0, 'Extracting');
      log.log('Total entries:', totalEntries);
      zipfile.on('entry', async (entry) => {
        if (/\/$/.test(entry.fileName)) {
          processedEntries++;
          const progress = Math.floor((processedEntries / totalEntries) * 100);
          progressCallback(progress, 'Extracting');
          log.log('Directory:', entry.fileName);
          zipfile.readEntry();
          return;
        }
        try {
          const readStream = await new Promise((resolve, reject) => {
            zipfile.openReadStream(entry, (err, stream) => {
              if (err) reject(err);
              else resolve(stream);
            });
          });
          const outputPath = path.join(gameDir, entry.fileName);
          const dir = path.dirname(outputPath);
          await fs.promises.mkdir(dir, { recursive: true });
          await pipeline(readStream, fs.createWriteStream(outputPath));
          entries.push(entry.fileName);
          processedEntries++;
          const progress = Math.floor((processedEntries / totalEntries) * 100);
          progressCallback(progress, 'Extracting' + entry.fileName);
          log.log('File:', entry.fileName);
          zipfile.readEntry();
        } catch (err) {
          log.error('Error extracting entry:', err);
          reject(err);
        }
      });
      zipfile.on('end', () => {
        progressCallback(100, 'Complete');
        log.log('Extraction complete', entries);
        log.log('processedEntries:', processedEntries);
        resolve(entries);
      });
      zipfile.on('error', (err) => {
        log.error('Error extracting zip:', err);
        reject(err);
      });
      zipfile.readEntry();
    });
  });
}
