const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/meu.html');
});

io.on('connection', (socket) => {
    socket.client.nick = socket.client.id;
    console.log('a user connected');

    socket.on('chat message', (msg) => {
        console.log('sid: ' + socket.client.id + '\tmessage: ' + msg);
        io.emit('chat message', socket.client.nick + " disse: " + msg);
    });

    socket.on('set nick', (msg) => {
        const oldNick = socket.client.nick
        io.emit('chat message', `${oldNick} trocou seu nome para ${msg}`);
        socket.client.nick = msg;
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});