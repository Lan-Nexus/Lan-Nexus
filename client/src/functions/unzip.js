import yauzl from 'yauzl';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import logger from '../main/logger';
import { FileLocation, progressCallback } from './utils.js';

const log = logger('unzip');

export default async function unzip(filename, gameName) {
  const tempDir = FileLocation.getTempDir();
  const gameDir = path.join(FileLocation.getGameDir(), gameName);

  log.log(`Unzipping ${path.join(tempDir, filename)} for ${gameName}`);
  log.log(`Extracting to ${gameDir}`);

  const zipPath = path.join(tempDir, filename);
  const extractedFiles = [];
  const skippedFiles = [];

  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);

      let processedEntries = 0;
      let totalEntries = zipfile.entryCount || 0;

      progressCallback(0, 'Extracting');
      log.log('Total entries:', totalEntries);

      zipfile.on('entry', async (entry) => {
        // Skip directories
        if (/\/$/.test(entry.fileName)) {
          processedEntries++;
          updateProgress(processedEntries, totalEntries, 'Processing directories');
          zipfile.readEntry();
          return;
        }

        // Validate file path to prevent directory traversal
        const normalizedPath = path.normalize(entry.fileName);
        if (normalizedPath.startsWith('..') || path.isAbsolute(normalizedPath)) {
          log.warn(`Skipping potentially dangerous path: ${entry.fileName}`);
          processedEntries++;
          updateProgress(processedEntries, totalEntries, 'Skipping dangerous file');
          zipfile.readEntry();
          return;
        }

        try {
          await extractFile(zipfile, entry, gameDir);
          extractedFiles.push(entry.fileName);
          processedEntries++;
          updateProgress(
            processedEntries,
            totalEntries,
            `Extracted: ${path.basename(entry.fileName)}`
          );
          log.log('File extracted:', entry.fileName);
        } catch (err) {
          log.warn(`Failed to extract ${entry.fileName}:`, err.message);
          skippedFiles.push({
            fileName: entry.fileName,
            error: err.message
          });
          processedEntries++;
          updateProgress(
            processedEntries,
            totalEntries,
            `Skipped: ${path.basename(entry.fileName)}`
          );
        }

        zipfile.readEntry();
      });

      zipfile.on('end', () => {
        progressCallback(100, 'Complete');
        log.log('Extraction complete');
        log.log('Extracted files:', extractedFiles.length);
        log.log('Skipped files:', skippedFiles.length);

        if (skippedFiles.length > 0) {
          log.warn('Some files were skipped:', skippedFiles);
        }

        zipfile.close();

        resolve({
          extractedFiles,
          skippedFiles,
          totalProcessed: processedEntries
        });
      });

      zipfile.on('error', (err) => {
        log.error('Error reading zip file:', err);
        reject(err);
      });

      zipfile.readEntry();
    });
  });
}

async function extractFile(zipfile, entry, gameDir) {
  const outputPath = path.join(gameDir, entry.fileName);
  const dir = path.dirname(outputPath);

  // Create directory if it doesn't exist
  await fs.promises.mkdir(dir, { recursive: true });

  // Check if file already exists and remove it
  try {
    await fs.promises.access(outputPath);
    await fs.promises.unlink(outputPath);
    log.log('Removed existing file:', outputPath);
  } catch (err) {
    // File doesn't exist, which is fine
  }

  // Special handling for .asar files and other problematic files
  const fileExt = path.extname(entry.fileName).toLowerCase();
  const problematicExts = ['.asar', '.exe', '.dll', '.app'];

  if (problematicExts.includes(fileExt)) {
    return await extractFileChunked(zipfile, entry, outputPath);
  } else {
    return await extractFileStream(zipfile, entry, outputPath);
  }
}

async function extractFileStream(zipfile, entry, outputPath) {
  const readStream = await new Promise((resolve, reject) => {
    zipfile.openReadStream(entry, (err, stream) => {
      if (err) reject(err);
      else resolve(stream);
    });
  });

  const writeStream = fs.createWriteStream(outputPath);

  try {
    await pipeline(readStream, writeStream);
  } catch (err) {
    // Clean up partially written file
    try {
      await fs.promises.unlink(outputPath);
    } catch (unlinkErr) {
      // Ignore cleanup errors
    }
    throw err;
  }
}

async function extractFileChunked(zipfile, entry, outputPath) {
  const readStream = await new Promise((resolve, reject) => {
    zipfile.openReadStream(entry, (err, stream) => {
      if (err) reject(err);
      else resolve(stream);
    });
  });

  // Read the entire file into memory first, then write it
  const chunks = [];

  return new Promise((resolve, reject) => {
    readStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    readStream.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks);
        await fs.promises.writeFile(outputPath, buffer);
        resolve();
      } catch (err) {
        reject(err);
      }
    });

    readStream.on('error', (err) => {
      reject(err);
    });
  });
}

function updateProgress(processed, total, message) {
  const progress = total > 0 ? Math.floor((processed / total) * 100) : 0;
  progressCallback(progress, message);
}