const users = {}; // Almacena usuarios conectados
const messages = []; // Almacena mensajes del chat grupal
const privateMessages = {}; // Almacena mensajes privados

function addUser(username, socket) {
    users[username] = socket;
}

function removeUser(username) {
    delete users[username];
}

module.exports = { users, addUser, removeUser, messages, privateMessages };
