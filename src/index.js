const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

io.on('connection', (socket) => {
    socket.client.nick = socket.client.id;
    io.emit('conexao', socket.client.nick + " entrou no chat");

    socket.on('chat message', (msg) => {
        io.emit('chat message', socket.client.nick + " disse: " + msg);
    });

    socket.on('set nick', (msg) => {
        const oldNick = socket.client.nick
        io.emit('chat message', `${oldNick} trocou seu nome para ${msg}`);
        socket.client.nick = msg;
    })

    socket.on('digitacao', (msg) => {
      console.log(msg)
      io.emit('digitacao', `${socket.client.nick} ${msg}`);
    })

    socket.on('disconnect', () => {
      io.emit('desconexao', socket.client.nick + " saiu do chat");
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});