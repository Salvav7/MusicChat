const { users, addUser, removeUser, messages, privateMessages } = require('./users');

function setupSocket(io) {
    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        if (username) {
            socket.username = username;
            next();
        } else {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`${socket.username} se ha conectado`);
        addUser(socket.username, socket);

        // Enviar lista de usuarios a todos
        io.emit('userList', Object.keys(users));

        // Enviar mensajes previos del chat grupal al usuario conectado
        socket.emit('previousMessages', messages);

        // Manejo de mensajes grupales
        socket.on('groupMessage', (msg) => {
            const message = { username: socket.username, msg };
            messages.push(message);
            io.emit('groupMessage', message);
        });

        // Manejo de mensajes privados
        socket.on('privateMessage', ({ to, msg }) => {
            const recipientSocket = users[to];
            if (recipientSocket) {
                recipientSocket.emit('privateMessage', { from: socket.username, msg });
                if (!privateMessages[socket.username]) privateMessages[socket.username] = {};
                if (!privateMessages[socket.username][to]) privateMessages[socket.username][to] = [];
                privateMessages[socket.username][to].push({ from: socket.username, msg });
                if (!privateMessages[to]) privateMessages[to] = {};
                if (!privateMessages[to][socket.username]) privateMessages[to][socket.username] = [];
                privateMessages[to][socket.username].push({ from: socket.username, msg });
            }
        });

        // Enviar mensajes previos del chat privado
        socket.on('openPrivateChat', (user) => {
            const privateChatHistory = privateMessages[socket.username]?.[user] || [];
            privateChatHistory.forEach(({ from, msg }) => {
                socket.emit('privateMessage', { from, msg });
            });
        });

        // Manejo de desconexión
        socket.on('disconnect', () => {
            console.log(`${socket.username} se ha desconectado`);
            removeUser(socket.username);
            io.emit('userList', Object.keys(users));
        });
    });
}

module.exports = { setupSocket };
