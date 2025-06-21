import Logger from "./utils/logger.js";

const logger = Logger('functions');

type Progress = {
  download: (
    progressCallback: (percent: string, message: string) => void,
    setActive: (active: boolean) => void,
    path: string,
    filename: string
  ) => Promise<void>;
  unzip: (
    progressCallback: (percent: string, message: string) => void,
    setActive: (active: boolean) => void,
    path: string,
    filename: string
  ) => Promise<void>;
  run: (
    progressCallback: (percent: string, message: string) => void,
    setActive: (active: boolean) => void,
    path: string,
    command: string
  ) => Promise<void>;
  isGameInstalled: (
    progressCallback: (percent: string, message: string) => void,
    setActive: (active: boolean) => void,
    path: string
  ) => Promise<boolean>;
  clearTemp: (progressCallback: (percent: string, message: string) => void) => Promise<void>;
  removeGame: (
    progressCallback: (percent: string, message: string) => void,
    setActive: (active: boolean) => void,
    path: string
  ) => Promise<void>;
  getServerIP: (progressCallback: (message: string) => void) => Promise<void>;
};

export default new Proxy({} as Progress, {
  get: function (_target, prop) {
    return (progressCallback, setActive, ...args) => {
      return new Promise((resolve, reject) => {
        window.electron.ipcRenderer.send('function', {
          functionName: prop,
          args: args,
        });

        window.electron.ipcRenderer.once('function-reply', (_event, arg) => {
          logger.log('Reply:', arg);
          resolve(arg);
        });

        window.electron.ipcRenderer.once('function-error', (_event, arg) => {
          logger.error('Error:', arg);
          reject(arg);
        });

        window.electron.ipcRenderer.on('function-progress', (_event, ...arg) => {
          logger.log('Progress:', arg);
          progressCallback(...arg);
        });
        window.electron.ipcRenderer.on('function-active', (_event, ...arg) => {
          logger.log('Active:', arg);
          setActive(...arg);
        });
        window.electron.ipcRenderer.on('function-log', (_event, ...arg) => {
          const logType = arg.shift();
          logger.log(logType, ...arg);
        });
      });
    };
  },
});
