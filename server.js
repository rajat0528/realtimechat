const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
require('dotenv').config();
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server); 

//Set static folders
app.use(express.static(path.join(__dirname, 'public')));

const botName = '24X7Chat Bot';

//Run when client connects
io.on('connection', socket => {   

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //Welcome current user (Broadcast to the current user)
        socket.emit('message', formatMessage(botName, 'Welcome to chatroom'));
        
        //broadcast to all connected clients except one use
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat.`));

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });  

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Run when client disconnects (broadcast to all connected clients from the server)
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){

            io.to(user.room).emit('message', formatMessage('User', `${user.username} has left the chat.`));
            
            //send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
            
    });
});

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))