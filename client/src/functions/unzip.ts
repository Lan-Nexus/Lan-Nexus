import yauzl from 'yauzl';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream/promises';



const openZip = promisify(yauzl.open);

export default async function unzip(filename,gameName) {

    const tempDir = path.join(__dirname, '../../temp');
    let gameDir = path.join(__dirname, '../../games');

    console.log(`Unzipping ${path.join(tempDir, filename)} for ${gameName}`);

    gameDir = path.join(gameDir, gameName);

    console.log(`Extracting to ${gameDir}`);

    const zipfile = await openZip(path.join(tempDir, filename), { lazyEntries: true });

    console.log('Zip file opened');

    return new Promise((resolve, reject) => {
      const entries = [];

      zipfile.on('entry', async (entry) => {
        if (/\/$/.test(entry.fileName)) {
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

          await pipeline(
            readStream,
            fs.createWriteStream(outputPath)
          );

          entries.push(entry.fileName);
          zipfile.readEntry();
        } catch (err) {
          reject(err);
        }
      });

      zipfile.on('end', () => {
        resolve(entries);
      });

      zipfile.on('error', (err) => {
        reject(err);
      });

      zipfile.readEntry();
    });
}

