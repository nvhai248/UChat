var socket = io();

// Gửi một sự kiện lên server
socket.emit('chat message', 'Hello, server!');

// Nhận một sự kiện từ server
socket.on('chat message', (msg) => {
    console.log('Message received: ' + msg);
});

