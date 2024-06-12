const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { setupSocket } = require('./socket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

setupSocket(io);

server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
