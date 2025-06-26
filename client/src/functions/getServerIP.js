/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dgram from 'dgram';
import Logger from '../main/logger.js';
import { clear } from 'console';

const logger = Logger('getServerIP');

const message = Buffer.from('lanLauncher://get_ip');
const knownPort = 50000;

let socket = null;
let interval = null;

export default async function getServerIP(stopSocket) {

  if (stopSocket) {
    logger.log('clearing interval');

    if (socket) {
      logger.log('closing socket');
      socket.close();
      socket = null;
    }
    clearInterval(interval);

    return;
  }
  return sendMessage();
}

function sendMessage() {

  return new Promise((resolve) => {
    if (socket) {
      socket.send(message, 0, message.length, knownPort, '255.255.255.255');
      return;
    }
    logger.log('Searching for server IP...');
    socket = dgram.createSocket('udp4');

    interval = setInterval(() => {
      if (socket) {
        logger.log('unable to find server IP, retrying...');
        socket.send(message, 0, message.length, knownPort, '255.255.255.255');
      }
    }, 1000);

    socket.on('listening', function () {
      socket.setBroadcast(true);
      logger.log('sending message to find server IP...');
      socket.send(message, 0, message.length, knownPort, '255.255.255.255');
    });

    socket.on('message', function (message, remote) {
      const data = JSON.parse(message.toString());
      logger.log('found server IP:', remote.address + ':' + data.port);
      resolve(data.protocol + '://' + remote.address + ':' + data.port);
      socket.close();

      clearInterval(interval);
      socket = null;
    });

    // Pick a random port between 49152 and 65535 for binding
    const port = Math.floor(Math.random() * (65535 - 49152 + 1)) + 49152;
    try {
      logger.log('binding to port:', port);
      socket.bind(port);
    } catch (error) {
      logger.error('Error binding socket:', error);
      socket = null;
      return sendMessage();
    }
  });

}
