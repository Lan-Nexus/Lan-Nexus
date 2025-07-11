import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// Custom APIs for renderer
const api = {
  function: async (...args: any) => {
    const functionName = args.shift();
    return await ipcRenderer.invoke('bridge', { functionName , args })
  }
};

// Progress-specific IPC API
const progressAPI = {
  onProgress: (callback: (amount: string, name: string) => void) => {
    console.log('progress')
    ipcRenderer.on('progress', (_event, { amount, name }) => callback(amount, name));
  },
  onProgressActive: (callback: (state: boolean) => void) => {
    console.log('progressActive')
    ipcRenderer.on('progressActive', (_event, state) => callback(state));
  },
  onProgressLoading: (callback: () => void) => {
    console.log('progressLoading')
    ipcRenderer.on('progressLoading', () => callback());
  }
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('progressAPI', progressAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = {}
  // @ts-ignore (define in dts)
  window.progressAPI = progressAPI
}
