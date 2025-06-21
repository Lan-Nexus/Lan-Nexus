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
        }
      }
    })
  } else {
    // For browser environment (renderer process)
    const styles = {
      log: 'color: white; background-color: green; padding: 2px 4px; border-radius: 2px;',
      warn: 'color: black; background-color: #ffc107; padding: 2px 4px; border-radius: 2px;',
      error: 'color: white; background-color: #dc3545; padding: 2px 4px; border-radius: 2px;',
      info: 'color: white; background-color: #007bff; padding: 2px 4px; border-radius: 2px;'
    }

    return new Proxy(console, {
      get(target, logType: string) {
        return (...args: any[]) => {
          const style = styles[logType as keyof typeof styles] || ''
          target[logType](`%c ➞ *[${type}]`, style, ...args)
        }
      }
    })
  }
}

logger('logger').log('Logger initialized')

export default logger