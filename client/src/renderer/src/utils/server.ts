import functions from '../functions.js';

let serverAddress;

export function getServerAddress() {
    if (serverAddress) {
        return serverAddress;
    }
    return new Promise((resolve, _reject) => {
        functions.getServerIP((ip) => {
            serverAddress = ip;
            resolve(serverAddress);
        });
    });
}