const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

const rooms = [{room_name: "Test", password: "123", selectedBoard: "Template - 1", users: []}];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected ' + rooms.length);
    socket.emit("get_rooms_sb", rooms);

    socket.on("create_room_bs", (...args) => {
        // TODO change username
        args[0].roomModel.users = [{id: socket.id, username: args[0].username}];
        rooms.push(args[0].roomModel);
        socket.join(args[0].roomModel.room_name);
        socket.emit("change_page_sb", {page: "roomLobbyPage", room: args[0].roomModel.room_name, users:args[0].roomModel.users});
        io.emit("get_rooms_sb", rooms);
    });

    socket.on("join_room_bs", (...args) =>{
        socket.join(args[0].roomName);
        let joinedRoom = rooms.find((room)=>room.room_name === args[0].roomName);
        joinedRoom.users.push({id: socket.id, username: args[0].username});
        socket.emit("change_page_sb", {page: "roomLobbyPage", room: args[0], users:joinedRoom.users});
        socket.to(args[0].roomName).emit("update_room_users_sb", joinedRoom.users );
    });

    socket.on("start_game_bs", (roomName) => {
        let joinedRoom = rooms.find((room)=>room.room_name === roomName);
        io.in(roomName).emit("start_game_sb", joinedRoom);
    });

    socket.on("move_player_bs", (args)=>{
        let playerId = args.playerId;
        let destinationTileId = args.destinationTileId;
        let roomName = args.roomName;
        console.log(`MOVE PLAYER(${playerId}) to ${destinationTileId} in room ${roomName}`);
        socket.in(roomName).emit("move_player_sb", {playerId, destinationTileId});
    });

});

http.listen(3000, () => {
    console.log('listening on *:3000');
});