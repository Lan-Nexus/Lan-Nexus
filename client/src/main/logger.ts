function logger(type: string): any {
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        if (typeof prop === 'string') {
          return (...args: any[]) => {
            const timestamp = new Date().toISOString()
            const message = `[${timestamp}] [${type}] [${prop}] ${args.join(' ')}`
            console.log(message)
          }
        }
        return target[prop]
      }
    }
  )
}

logger('logger').log('Logger initialized')

export default logger