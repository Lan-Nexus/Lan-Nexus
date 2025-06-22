/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dgram from 'dgram';
import Logger from '../main/logger.js';

const logger = Logger('getServerIP');

const message = Buffer.from('lanLauncher://get_ip');

let socket = null;

export default async function getServerIP(progressCallback) {
  sendMessage(progressCallback);
}

function sendMessage(progressCallback) {

  if (socket) {
    socket.send(message, 0, message.length, 50000, '255.255.255.255');
    return;
  }
  logger.log('Searching for server IP...');
  socket = dgram.createSocket('udp4');

  const interval = setInterval(() => {
    if (socket) {
      logger.log('unable to find server IP, retrying...');
      socket.send(message, 0, message.length, 50000, '255.255.255.255');
    }
  }, 1000);

  socket.on('listening', function () {
    socket.setBroadcast(true);
    logger.log('sending message to find server IP...');
    socket.send(message, 0, message.length, 50000, '255.255.255.255');
  });

  socket.on('message', function (message, remote) {
    const data = JSON.parse(message.toString());
    progressCallback(data.protocol + '://' + remote.address + ':' + data.port);
    socket.close();
    logger.log('found server IP:', remote.address + ':' + data.port);
    clearInterval(interval);
    socket = null;
  });

  // Pick a random port between 49152 and 65535 for binding
  const port = Math.floor(Math.random() * (65535 - 49152 + 1)) + 49152;
  try {
    socket.bind(port);
  } catch (error) {
    logger.error('Error binding socket:', error);
    socket = null;
    sendMessage(progressCallback);
  }

}
