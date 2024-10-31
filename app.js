const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the index.html file on the root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Create a custom namespace called "chat"
const chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket) => {
    console.log('A user connected to the chat namespace', socket.id);

    // Listen for chat messages in this namespace
    socket.on('chat message', (msg) => {
        chatNamespace.emit('chat message', msg); // Emit to all sockets in this namespace
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected from chat namespace');
    });
});

// You can add other namespaces similarly if needed
// const anotherNamespace = io.of('/anotherNamespace');
// anotherNamespace.on('connection', (socket) => {
//     // Handle events for this namespace
// });

const PORT = process.env.PORT || 7001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
