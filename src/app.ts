import http from 'http';
import express from 'express';
import { join } from 'path';
import { Server } from 'socket.io';
import userslist from './utils/user-list';

const port = process.env.PORT || 3000;

const app = express()
const server = http.createServer(app)
const io = new Server(server);

app.use(express.static(join(__dirname, "..", "public")))

io.on('connection', (socket) => {

    socket.on('join', (queryObj, callback) => {
        const { error, user } = userslist.addUser({ id: socket.id, ...queryObj })
        if (error) { return callback(error) }

        socket.join(user?.room || '')
        io.to(user?.room || '').emit('listUpdate', userslist.userList(user?.room || ''))
        callback()
    })

    socket.on('send', ({ message, time, username, room }, callback) => {
        room = room.trim().toLowerCase()
        username = username.trim().toLowerCase()
        socket.to(room).emit('receive', { message, time, username })
        callback()
    })

    socket.on('disconnect', () => {
        const user = userslist.removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('listUpdate', userslist.userList(user.room))
        }
    })
})


server.listen(port, () => { console.log('Server is Running on http://localhost:3000') });