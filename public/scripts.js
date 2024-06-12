let socket;
let currentPrivateChatUser = null;
let darkMode = false;

function login() {
    const username = document.getElementById('username').value;

    if (username) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
        document.getElementById('group-chat').style.display = 'flex';
        initSocket(username);
    } else {
        alert('Please enter a username');
    }
}

function initSocket(username) {
    socket = io({
        auth: {
            username
        }
    });

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('previousMessages', (messages) => {
        const messagesDiv = document.getElementById('group-messages');
        messages.forEach(message => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-message', 'other');
            msgDiv.innerHTML = `<i class="fas fa-user-circle fa-2x"></i> ${message.username}: ${message.msg}`;
            messagesDiv.appendChild(msgDiv);
        });
    });

    socket.on('groupMessage', (message) => {
        const messagesDiv = document.getElementById('group-messages');
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', 'other');
        msgDiv.innerHTML = `<i class="fas fa-user-circle fa-2x"></i> ${message.username}: ${message.msg}`;
        messagesDiv.appendChild(msgDiv);
    });

    socket.on('privateMessage', ({ from, msg }) => {
        if (currentPrivateChatUser === from) {
            const messagesDiv = document.getElementById('private-messages');
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-message', 'other');
            msgDiv.innerHTML = `<i class="fas fa-user-circle fa-2x"></i> ${from}: ${msg}`;
            messagesDiv.appendChild(msgDiv);
        } else {
            alert(`Private message from ${from}: ${msg}`);
        }
    });

    socket.on('userList', (userList) => {
        const usersUl = document.getElementById('users');
        usersUl.innerHTML = '';
        userList.forEach(user => {
            if (user !== username) {
                const userLi = document.createElement('li');
                userLi.classList.add('list-group-item', 'user-item');
                userLi.innerHTML = `<i class="fas fa-user-circle fa-2x"></i> ${ user}`;
                userLi.onclick = () => openPrivateChat( user);
                usersUl.appendChild(userLi);
            }
        });
    });
}

function sendGroupMessage() {
    const msg = document.getElementById('groupMessage').value;
    document.getElementById('groupMessage').value = '';
    socket.emit('groupMessage', msg);

    const messagesDiv = document.getElementById('group-messages');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', 'user');
    msgDiv.innerHTML = `<i class="fas fa-user-circle fa-2x"></i> You: ${msg}`;
    messagesDiv.appendChild(msgDiv);
}

function sendPresetGroupMessage(msg) {
    socket.emit('groupMessage', msg);

    const messagesDiv = document.getElementById('group-messages');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', 'user');
    msgDiv.innerHTML = `<i class="fas fa-user-circle fa-2x"></i> You: ${msg}`;
    messagesDiv.appendChild(msgDiv);
}

function openPrivateChat(user) {
    currentPrivateChatUser = user;
    document.getElementById('private-chat-username').textContent = user;
    document.getElementById('private-chat').style.display = 'flex';
    document.getElementById('group-chat').style.display = 'none';
    document.getElementById('private-messages').innerHTML = '';
    socket.emit('openPrivateChat', user);
}

function sendPrivateMessage() {
    const msg = document.getElementById('privateMessage').value;
    document.getElementById('privateMessage').value = '';
    const to = currentPrivateChatUser;
    socket.emit('privateMessage', { to, msg });

    const messagesDiv = document.getElementById('private-messages');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', 'user');
    msgDiv.innerHTML = `<i class="fas fa-user-circle fa-2x"></i> You: ${msg}`;
    messagesDiv.appendChild(msgDiv);
}

function sendPresetPrivateMessage(msg) {
    const to = currentPrivateChatUser;
    socket.emit('privateMessage', { to, msg });

    const messagesDiv = document.getElementById('private-messages');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', 'user');
    msgDiv.innerHTML = `<i class="fas fa-user-circle fa-2x"></i> You: ${msg}`;
    messagesDiv.appendChild(msgDiv);
}

function goToGroupChat() {
    document.getElementById('private-chat').style.display = 'none';
    document.getElementById('group-chat').style.display = 'flex';
}

function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}
