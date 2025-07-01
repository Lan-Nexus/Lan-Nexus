import dgram from 'dgram';
const socket = dgram.createSocket('udp4');
const port = Number(process.env.PORT) || 3000
const protocol = process.env.PROTOCOL || 'http'
const broadcastPort = 50000;

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

// Listen on a range of ports
const startPort = broadcastPort;
const endPort = broadcastPort; // Example: listen on 10 ports

for (let p = startPort; p <= endPort; p++) {
    const s = dgram.createSocket('udp4');
    s.on('message', (...args) => socket.emit('message', ...args));
    s.bind(p, () => {
        console.log(`Listening on UDP port ${p}`);
    });
}