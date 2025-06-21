import dgram from 'dgram';
const socket = dgram.createSocket('udp4');
const port = Number(process.env.PORT) || 3000
const broadcastPort = Number(process.env.BROADCAST_PORT) || 3001
const protocol = process.env.PROTOCOL || 'http'

const response = {
    protocol: protocol,
    port: port
};

socket.on('message', function (message, remote) {
    const msgStr = message.toString();
    try {
        const url = new URL(msgStr);
        if (url.protocol === 'lanlauncher:') {
            if (url.hostname === 'get_ip') {
                const json = JSON.stringify(response);
                socket.send(json, 0, Buffer.byteLength(json), remote.port, remote.address);
                console.log('Sent response to', remote.address + ':' + remote.port + ' - ' + json);
            }
        }
    } catch (e) {
        return;
    }
});

socket.bind(broadcastPort);