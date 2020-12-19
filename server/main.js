const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

const rooms = [{room_name: "Test", password: "123", selectedBoard: "Template - 1", users: []}];

function getUserRoom(userId){
    return rooms.find((room)=>{
        if(room.users.find((user)=>user.id === userId)){
            return true;
        }else{
            return false;
        }
    });
}

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
        socket.to(args[0].roomName).emit("update_room_users_sb", {roomName: args[0].roomName, users:joinedRoom.users} );
    });

    socket.on("start_game_bs", (roomName) => {
        let joinedRoom = rooms.find((room)=>room.room_name === roomName);
        console.log("JOINED ROOM:" + JSON.stringify(joinedRoom, null, 2));
        io.in(roomName).emit("start_game_sb", joinedRoom);
    });

    socket.on("move_player_bs", (args)=>{
        let playerId = args.playerId;
        let destinationTileId = args.destinationTileId;
        io.in(getUserRoom(playerId).room_name).emit("move_player_sb", args);
    });

    socket.on("determineStartOrder_bs", (args)=>{
        let sum = args.sum;
        let userId = args.userId;
        let currentRoom = getUserRoom(userId);
        let currentUser = currentRoom.users.find(user=>user.id===userId);
        currentUser.dice = sum;
        console.log("The player " + currentUser.username + " rolled " + sum);

        let isFinished = true;
        for(let i = 0; i < currentRoom.users.length; i++){
            if(!currentRoom.users[i].dice){
                isFinished = false;
            }
        }
        if(isFinished){
            currentRoom.users.sort((a,b)=>a.dice<b.dice ? 1 : -1);
            console.log("Game is starting. First player is " + currentRoom.users[0].username);
            io.to(currentRoom.users[0].id).emit("nextState", {stateName: "playNormalTurn", payload: {}});
            for(let i = 1; i < currentRoom.users.length; i++){
                io.to(currentRoom.users[i].id).emit("nextState", {stateName: "waitOtherPlayerTurn", payload: {}});
            }
        }
    });

});

http.listen(3000, () => {
    console.log('listening on *:3000');
});