import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import Logger from './logger.js'
import { screen } from 'electron';
import './function.js'

const logger = Logger('main');

function setupAutoUpdater() {
  // Configure auto-updater
  console.log(!is.dev && app.getVersion() != '0.0.0');
  if (!is.dev && app.getVersion() != '0.0.0') {
    autoUpdater.checkForUpdatesAndNotify();
  }
  autoUpdater.logger = logger;

  // Auto-updater events
  autoUpdater.on('checking-for-update', () => {
    logger.log('Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    logger.log('Update available.', info);

    // Show progress bar for update download
    import('../functions/utils.js').then(({ progressActive, progressLoading }) => {
      progressActive(true);
      progressLoading();
    });

    // Send to all windows
    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('update-available', info);
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    logger.log('Update not available.', info);

    // Hide progress bar if no update available
    import('../functions/utils.js').then(({ progressActive }) => {
      progressActive(false);
    });

    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('update-not-available', info);
    });
  });

  autoUpdater.on('error', (err) => {
    logger.error('Error in auto-updater. ' + err);

    // Hide progress bar on error
    import('../functions/utils.js').then(({ progressActive }) => {
      progressActive(false);
    });

    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('updater-error', err);
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    logger.log(log_message);

    // Use the normal progress system
    import('../functions/utils.js').then(({ progressCallback }) => {
      progressCallback(progressObj.percent, 'Downloading Update');
    });

    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('download-progress', progressObj);
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    logger.log('Update downloaded', info);

    // Hide progress bar when download is complete
    import('../functions/utils.js').then(({ progressActive, progressCallback }) => {
      progressCallback('100%', 'Update Ready');
      setTimeout(() => {
        progressActive(false);
      }, 1000);
    });

    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('update-downloaded', info);
    });
    // Auto-install after 5 seconds
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 5000);
  });
}

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
  const primaryDisplay = screen.getPrimaryDisplay();
  const screenWidth = primaryDisplay.workAreaSize.width;
  const screenHeight = primaryDisplay.workAreaSize.height;

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 700,
    minHeight: 670,
    maxWidth: screenWidth,
    maxHeight: screenHeight,
    title: 'demo',
    show: false,
    autoHideMenuBar: true,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  });

  // Set mainWindow for progress utils
  import('../functions/utils.js').then(({ setMainWindow }) => setMainWindow(mainWindow));


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


  // Initialize auto-updater
  setupAutoUpdater();



  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  // Auto-updater IPC handlers
  ipcMain.handle('app-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('check-for-updates', async () => {
    try {
      return await autoUpdater.checkForUpdates();
    } catch (error) {
      logger.error('Failed to check for updates:', error);
      throw error;
    }
  });

  ipcMain.handle('quit-and-install', async () => {
    try {
      autoUpdater.quitAndInstall();
    } catch (error) {
      logger.error('Failed to quit and install:', error);
      throw error;
    }
  });

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


// ipcMain.on('function', async (event, arg) => {
//   const id = arg.id
//   const progressCallback = (...args) => event.reply('function-progress', id, ...args);
//   const activeCallback = (...args) => event.reply('function-active', id, ...args);

//   const safeFunctionName = arg.functionName.replace(/[^a-zA-Z0-9]/g, '');
//   if (
//     safeFunctionName !== arg.functionName ||
//     safeFunctionName.length === 0 ||
//     safeFunctionName.length > 100
//   ) {
//     event.reply('function-error', id, 'Invalid function name');
//     return;
//   }
//   logger.log('function called', safeFunctionName, { id }, arg.args);
//   const func = await import(`../functions/${safeFunctionName}.js`);

//   if (!func) {
//     event.reply('function-error', id, 'Function not found');
//     return;
//   }

//   logger.log('function called', safeFunctionName);
//   try {
//     const result = await func.default(progressCallback, activeCallback, ...arg.args);
//     logger.log('function result', id, result);
//     event.reply('function-reply', id, result);
//   } catch (e) {
//     logger.error(e);
//     event.reply('function-error', id, e);
//   }
// });
