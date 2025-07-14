import { exec } from 'child_process';
import path from 'path';
import { FileLocation } from './utils.js';

/**
 * Opens Windows File Explorer at the specified file or folder location.
 * @param {string} targetPath - The file or folder path to open.
 */
function openFileLocation(targetPath) {
    if (!targetPath) return;
    // If it's a file, open its folder and select it. If folder, just open.
    console.log('Opening file location:', path.join(FileLocation.getGameDir(), targetPath));
    const command = `explorer.exe ${path.join(FileLocation.getGameDir(), targetPath)}`;
    exec(command);
}

module.exports = openFileLocation;