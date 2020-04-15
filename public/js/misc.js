const roomList = document.getElementById('room');

const rooms = [
    {
        slug:   'AWS',
        name:   'AWS(Amazon Web Services)'
    },
    {
        slug:   'Azure',
        name:   'Microsoft Azure'
    },
    {
        slug:   'GCP',
        name:   'Google Cloud Platform'
    },
    {
        slug:   'NodeJs',
        name:   'NodeJs'
    },
    {
        slug:   'Angular',
        name:   'Angular'
    },
    {
        slug:   'SocketIO',
        name:   'Socket.IO'
    }
]

function showRooms() {
    roomList.innerHTML = `
        ${rooms.map(room => `<option value="${room.slug}">${room.name}</option>`).join('')}
    `;
}
showRooms();