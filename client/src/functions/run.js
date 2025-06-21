import path from 'path';
import { exec } from 'child_process';
import updateRegistry from './runUtils/updateRegistry';


/**
 * Executes user-provided async code in the context of a specific game directory.
 * 
 * @param {function(string): void} progressCallback - Callback to report progress or errors.
 * @param {string} gameName - The name of the game whose directory will be used.
 * @param {string} code - The async JavaScript code to execute, as a string.
 * @param {Array} [args=[]] - Optional arguments to pass to the user code.
 * @returns {Promise<void>} Resolves when the user code has finished executing.
 * 
 * @throws {Error} If the executed command fails or the user code throws.
 * 
 * @note This function dynamically executes arbitrary code, which is generally a terrible idea for security reasons. 
 *       Please don't let your users run wild with this!
 */
export default async function(progressCallback, progressActive, gameName, code, args = []) {
  let gameDir = path.join(__dirname, '../../games', gameName);

  function run(cmdPath) {
    return new Promise((resolve, reject) => {
      const fullPath = path.join(gameDir, cmdPath);
      exec(fullPath, { cwd: gameDir }, (error, stdout, stderr) => {
        if (error) {
          if (progressCallback) progressCallback(`Error: ${error.message}`);
          reject(error);
        } else {
          if (progressCallback) progressCallback(stdout);
          resolve(stdout);
        }
      });
    });
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;



  const util = {
    gameName,
    run,
    args,
    sleep,
    progress: progressCallback,
    updateRegistry,
    progressCallback,
    showProgress: () => {
        progressActive(true);
    }, 
    hideProgress: () => {
        progressActive(false);
    },
    error: (message) => {
        throw new Error(message);
    },
  };

  const fn = new AsyncFunction(...Object.keys(util), code);
  await fn(...Object.values(util));
}
