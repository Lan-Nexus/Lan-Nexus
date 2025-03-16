export default new Proxy(
  {},
  {
    get: function (_target, prop) {
      return (progressCallback, ...args) => {
        return new Promise((resolve, reject) => {
          window.electron.ipcRenderer.send('function', {
            functionName: prop,
            args: args,
          });

          window.electron.ipcRenderer.once('function-reply', (_event, arg) => {
            resolve(arg);
          })

          window.electron.ipcRenderer.once('function-error', (_event, arg) => {
            reject(arg);
          });

          window.electron.ipcRenderer.on('function-progress', (_event, ...arg) => {
            console.log('Progress:', arg);
            progressCallback(...arg);
          })

        })
      };
    },
  }
);
