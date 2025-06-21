import yauzl from 'yauzl';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

const openZip = (buffer, options = {}) => new Promise((resolve, reject) => {
  yauzl.fromBuffer(buffer, { lazyEntries: true, ...options }, (err, zipfile) => {
    if (err) reject(err);
    else resolve(zipfile);
  });
});

export default async function unzip(progressCallback, progressActive, filename, gameName) {
  const tempDir = path.join(__dirname, '../../temp');
  const gameDir = path.join(__dirname, '../../games', gameName);

  console.log(`Unzipping ${path.join(tempDir, filename)} for ${gameName}`);
  console.log(`Extracting to ${gameDir}`);

  // Read the zip file into a buffer
  const zipBuffer = await fs.promises.readFile(path.join(tempDir, filename));

  // Get an approximate entry count first to track progress
  const countZipfile = await openZip(zipBuffer);
  let totalEntries = 0;

  await new Promise((resolve, reject) => {
    countZipfile.on('entry', () => {
      totalEntries++;
      countZipfile.readEntry();
    });

    countZipfile.on('end', resolve);
    countZipfile.on('error', reject);
    countZipfile.readEntry();
  });

  // Now open the zip file again for actual extraction
  const zipfile = await openZip(zipBuffer);

  return new Promise((resolve, reject) => {
    const entries = [];
    let processedEntries = 0;

    // Call with 0% at start
    progressCallback(0, 'Extracting');
    console.log('Total entries:', totalEntries);

    zipfile.on('entry', async (entry) => {
      if (/\/$/.test(entry.fileName)) {
        // Directory entry
        processedEntries++;
        const progress = Math.floor((processedEntries / totalEntries) * 100);
        progressCallback(progress, 'Extracting');
        console.log('Directory:', entry.fileName);
        zipfile.readEntry();
        return;
      }

      try {
        // Promisify stream opening
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

        // Calculate and report progress (0-100)
        const progress = Math.floor((processedEntries / totalEntries) * 100);
        progressCallback(progress, 'Extracting' + entry.fileName);
        console.log('File:', entry.fileName);

        zipfile.readEntry();
      } catch (err) {
        console.error('Error extracting entry:', err);
        reject(err);
      }
    });

    zipfile.on('end', () => {
      progressCallback(100, 'Complete');
      console.log('Extraction complete', entries);
      console.log('processedEntries:', processedEntries);
      resolve(entries);
    });

    zipfile.on('error', (err) => {
      console.error('Error extracting zip:', err);
      reject(err);
    });

    zipfile.readEntry();
  });
}

