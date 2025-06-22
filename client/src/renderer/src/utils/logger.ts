export interface LogEntry {
  type: string;
  logType: string;
  color: string;
  args: any[];
  timestamp: number;
}

export const history: LogEntry[] = [];

function logger(type: string): Console {
  // For node environment (main process)
  if (typeof window === 'undefined') {
    const colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m'
    }

    return new Proxy(console, {
      get(target, logType: string) {
        return (...args: any[]) => {
          let color = colors.reset
          switch (logType) {
            case 'log':
              color = colors.green
              break
            case 'warn':
              color = colors.yellow
              break
            case 'error':
              color = colors.red
              break
            case 'info':
              color = colors.blue
              break
          }
          target[logType](`${color} -> *[${type}]${colors.reset}`, ...args)
          history.push({
            type,
            logType,
            color,
            args,
            timestamp: Date.now()
          })
        }
      }
    })
  } else {
    // For browser environment (renderer process)
    const colors = {
      red: 'color: red',
      green: 'color: green',
      yellow: 'color: yellow',
      blue: 'color: blue'
    }

    return new Proxy(console, {
      get(target, logType: string) {
        return (...args: any[]) => {
          let color = ''
          switch (logType) {
            case 'log':
              color = colors.green
              break
            case 'warn':
              color = colors.yellow
              break
            case 'error':
              color = colors.red
              break
            case 'info':
              color = colors.blue
              break
          }
          target[logType](`%c -> *[${type}]`, color, ...args)
          history.push({
            type,
            logType,
            color,
            args,
            timestamp: Date.now()
          })
        }
      }
    })
  }
}

logger('logger').log('Logger initialized')

export default logger