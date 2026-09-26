const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const { validate, version } = require('uuid');

const io = new Server(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const PORT = process.env.PORT || 3000;

function getAllRooms() {
    const allRooms = Array.from(io.sockets.adapter.rooms.keys());
    const filtered = allRooms.filter(roomId => validate(roomId) && version(roomId) === 4);

    return filtered;
}

io.on('connection', (socket) => {
    console.log('a user connected');

    const rooms = getAllRooms()

    socket.emit('ROOMS_LIST', rooms)

    socket.on('JOIN_ROOM', (roomId) => {
        const { rooms: joinedRooms } = socket;

        if (Array.from(joinedRooms).includes(roomId)) {
            return console.warn('user already in room');
        }

        socket.join(roomId)
        io.emit('ROOMS_LIST', getAllRooms())

        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        clients.forEach(clientId => {
            if (clientId === socket.id) return;

            io.to(clientId).emit('ADD_PEER', {
                peerId: socket.id,
                initiator: false
            })

            socket.emit('ADD_PEER', {
                peerId: clientId,
                initiator: true
            })
        })

    })

    socket.on('LEAVE_ROOM', (roomId) => {
        if (!roomId || !socket.rooms.has(roomId)) return;

        socket.to(roomId).emit('REMOVE_PEER', { peerId: socket.id })
        socket.leave(roomId)
        io.emit('ROOMS_LIST', getAllRooms())
    })

    socket.on('RELAY_SDP', ({ peerId, remoteDescription }) => {
        io.to(peerId).emit('SESSION_DESCRIPTION', {
            peerId: socket.id,
            remoteDescription
        })
    })

    socket.on('RELAY_ICE_CANDIDATE', ({ target, candidate }) => {
        io.to(target).emit('ICE_CANDIDATE', {
            peerId: socket.id,
            candidate
        })
    })

    socket.on('disconnecting', () => {
        socket.rooms.forEach((roomId) => {
            if (roomId === socket.id) return;

            socket.to(roomId).emit('REMOVE_PEER', { peerId: socket.id })
        })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('ROOMS_LIST', getAllRooms())
    });
})

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});