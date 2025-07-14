import Logger from '../main/logger.js';
import { app } from 'electron';
import path from 'path';

let mainWindow = null;

export function setMainWindow(win) {
  mainWindow = win;
}

export const progressCallback = (amount, name) => {
  Logger('progress').log(name + ' : ' + amount);
  if (mainWindow) {
    mainWindow.webContents.send('progress', { amount, name });
  } else {
    Logger('progress').log('mainWindow not set!');
  }
};

export const progressActive = (state) => {
  Logger('progressActive').log(state);
  if (mainWindow) {
    mainWindow.webContents.send('progressActive', state);
  } else {
    Logger('progressActive').log('mainWindow not set!');
  }
};

export const progressLoading = () => {
  Logger('progressLoading').log('Loading...');
  if (mainWindow) {
    mainWindow.webContents.send('progressLoading');
  } else {
    Logger('progressLoading').log('mainWindow not set!');
  }
}

export class FileLocation {

  static getGameDir() {
    return path.join(app.getPath('appData'), app.getName(), 'games');
  }

  static getTempDir() {
    return path.join(app.getPath('temp'), app.getName());
  }
}