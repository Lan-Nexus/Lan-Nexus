import functions from '../functions.js';
import Logger from './logger.js';
const logger = Logger('server');

let serverAddress;

export function getServerAddress() {
    if (serverAddress) {
        logger.log('Using cached server address:', serverAddress);
        return serverAddress;
    }
    return new Promise((resolve, _reject) => {
        logger.log('Fetching server address...');
        functions.getServerIP((ip) => {
            if (!ip) {
                logger.error('Failed to fetch server address');
                return;
            }
            logger.log('Server address fetched:', ip);
            serverAddress = ip;
            resolve(serverAddress);
        });
    });
}