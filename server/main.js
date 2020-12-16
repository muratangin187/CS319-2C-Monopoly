const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

const rooms = [{room_name: "Test", password: "123", selectedBoard: "Template - 1"}];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("get_rooms_bs", () => {
        console.log("server - get_rooms_bs");
        io.emit("get_rooms_sb", rooms);
    });

    socket.on("create_room_bs", (...args) => {
        rooms.push(args[0]);
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});