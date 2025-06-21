import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import Logger from './logger.js'

const logger = Logger('main');

let iconPath: Promise<string>;
if (process.platform == 'linux') {
  iconPath = import('../../resources/icon.png?asset').then((module) => module.default);
} else if (process.platform == 'win32') {
  iconPath = import('../../resources/icon.ico?asset').then((module) => module.default);
} else if (process.platform == 'darwin') {
  iconPath = import('../../resources/icon.icns?asset').then((module) => module.default);
}

async function createWindow() {
  const icon = await iconPath;
  logger.log(icon);
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 640,
    minHeight: 670,
    title: 'demo',
    show: false,
    autoHideMenuBar: true,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  });


  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('function', async (event, arg) => {
  const id = arg.id
  const progressCallback = (...args) => event.reply('function-progress',id, ...args);
  const activeCallback = (...args) => event.reply('function-active',id, ...args);

  const safeFunctionName = arg.functionName.replace(/[^a-zA-Z0-9]/g, '');
  if (
    safeFunctionName !== arg.functionName ||
    safeFunctionName.length === 0 ||
    safeFunctionName.length > 100
  ) {
    event.reply('function-error', id,'Invalid function name');
    return;
  }
   logger.log('function called', safeFunctionName,{id}, arg.args);  
  const func = await import(`../functions/${safeFunctionName}.js`);
  
  if (!func) {
    event.reply('function-error',id, 'Function not found');
    return;
  }

  logger.log('function called', safeFunctionName);
  try {
    const result = await func.default(progressCallback, activeCallback, ...arg.args);
    logger.log('function result',id, result);
    event.reply('function-reply',id, result);
  } catch (e) {
    logger.error(e);
    event.reply('function-error',id, e);
  }
});
