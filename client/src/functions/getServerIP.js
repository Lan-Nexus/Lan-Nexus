/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dgram from 'dgram';
import Logger from '../main/logger.js';

const logger = Logger.getLogger('getServerIP');

const message = Buffer.from('lanLauncher://get_ip');

let socket = null;

export default async function getServerIP(progressCallback) {
    sendMessage(progressCallback);
}

function sendMessage(progressCallback) {
    if (socket) {
        socket.send(message, 0, message.length, 3001, '255.255.255.255');
        return;
    }

    socket = dgram.createSocket('udp4');

    const interval = setInterval(() => {
        if (socket) {
            socket.send(message, 0, message.length, 3001, '255.255.255.255');
        }
    }, 1000);

    socket.on('listening', function () {
        socket.setBroadcast(true);
        socket.send(message, 0, message.length, 3001, '255.255.255.255');
    });

    socket.on('message', function (message, remote) {
        const data = JSON.parse(message.toString());
        progressCallback(data.protocol + '://' + remote.address + ':' + data.port);
        socket.close();
        clearInterval(interval);
        socket = null;
    });

    socket.bind(1337);
}
