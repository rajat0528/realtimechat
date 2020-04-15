const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and rooms from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true 
});

const socket = io();

//Join chatroom
socket.emit('joinRoom', {username, room});

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRooms(room);
    outputUsers(users);
});

//Message from server
socket.on('message', message => {
    outputMessage(message);

    //Scroll down the chat window when new message receives
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

//Chat message submittion
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage', msg);

    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRooms(room) {
    roomName.innerText = room;
}

//Add user name to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
