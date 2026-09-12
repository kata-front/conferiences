const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io')

const io = new Server(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const PORT = process.env.PORT || 3000;

function getAllRooms() {
    const rooms = Array.from(io.sockets.adapter.rooms.keys())
       .filter(roomId => !io.sockets.sockets.has(roomId))
    return rooms
}

io.on('connection', (socket) => {
    console.log('a user connected');

    const rooms = getAllRooms()

    socket.emit('ROOMS_LIST', rooms)

    socket.on('CREATE_ROOM', roomId => {
        socket.join(roomId)
        const rooms = getAllRooms()
        socket.emit('ROOMS_LIST', rooms)
    })


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

http.listen(PORT, () => {
    console.log('listening on *:3000');
});