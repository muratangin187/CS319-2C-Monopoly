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

app.get('/selam', (req, res) => {
    res.send("asd");
});


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit("test", "MERHABALAR");
    setTimeout(()=>{

        socket.emit("test", "SELAM AQ");
    },2000);
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

