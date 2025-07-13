import path from 'path';
import runUtils from './../../../runUtils/index.js';
import { progressCallback, progressActive, progressLoading, FileLocation } from './utils.js';


/**
 * Executes user-provided async code in the context of a specific game directory.
 *
 * @param {function(string): void} progressCallback - Callback to report progress or errors.
 * @param {string} gameName - The name of the game whoseirectory will be used.
 * @param {string} code - The async JavaScript code to execute, as a string.
 * @param {Array} [args=[]] - Optional arguments to pass to the user code.
 * @returns {Promise<void>} Resolves when the user code has finished executing.
 *
 * @throws {Error} If the executed command fails or the user code throws.
 *
 * @note This function dynamically executes arbitrary code, which is generally a terrible idea for security reasons.
 *       Please don't let your users run wild with this!
 */
export default async function (gameName, code, args = []) {
  console.log(`Running code for game: ${gameName} with args:`, args);
  const gameDir = path.join(FileLocation.getGameDir(), gameName);

  const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
  console.log(`Executing code for game: ${gameName} in directory: ${gameDir}`);
  const functions = await runUtils({ _gameDir: gameDir });

  const util = {
    gameName,
    GAME_DIR: gameDir,
    ...args,
    ...functions,
    progress: progressCallback,
    progressLoading: () => {
      progressLoading();
    },
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
