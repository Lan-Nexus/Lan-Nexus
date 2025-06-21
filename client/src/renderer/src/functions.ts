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
          resolve(arg);
        });

        window.electron.ipcRenderer.once('function-error', (_event, arg) => {
          reject(arg);
        });

        window.electron.ipcRenderer.on('function-progress', (_event, ...arg) => {
          console.log('Progress:', arg);
          progressCallback(...arg);
        });
        window.electron.ipcRenderer.on('function-active', (_event, ...arg) => {
          console.log('Active:', arg);
          setActive(...arg);
        });
        window.electron.ipcRenderer.on('function-log', (_event, ...arg) => {
          console.log('Log:', arg);
        });
      });
    };
  },
});
