const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});
const rooms = [];


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    //listen create_room_send
    socket.on("create_room_send", (roomModel) => {
        console.log("create_room_send is listened: " + JSON.stringify(roomModel));
        rooms.push(roomModel);
        console.log(rooms);
        io.sockets.emit("create_room_response", rooms);
        console.log("Test");
    })
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});