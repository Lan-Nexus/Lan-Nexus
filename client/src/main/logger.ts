 function logger(type: string): Console {
    return new Proxy(console, {
        get(target, logType: string) {
            return (...args: any[]) => {
                target[logType](`*[${type}]`, ...args);
            };
        }
    });
}

logger('logger').log('Logger initialized');


export default logger