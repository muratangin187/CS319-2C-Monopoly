var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("create_room_emit", (arg) => {
        console.log("Server: " + JSON.stringify(arg));
        io.sockets.emit("create_room_on", arg.room_name);
    })
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});