// Define an interface with the specific function signatures you expect.
interface Api {
  download(url: string, archiveFile: string): Promise<void>;
  unzip(archiveFile: string, safeName: string): Promise<void>;
  run(safeName: string, command: string, env?: Record<string, string>): Promise<void>;
  clearTemp(): Promise<void>;
  getServerIP(stopRequesting?: boolean): Promise<string>;
  getRunningPrograms(): Promise<string[]>;
  [key: string]: (...args: any[]) => Promise<any>;
}

const api = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return async (...args: any[]) => await window.api.function(prop, ...args);
    }
  }
) as Api;

export default api;
