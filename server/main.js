const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

const rooms = [{room_name: "Test", password: "123", selectedBoard: "Template - 1", users: []}];

const characters = [
    //TODO fill the placeholders with char description
    {id: 1, charName: "Character - 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum placerat eros, at condimentum odio pretium et. Quisque pellentesque gravida tellus, eget sagittis est vulputate eu. Proin interdum vulputate eleifend. Donec laoreet id erat ac posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi lobortis hendrerit augue. In feugiat congue felis, eget luctus erat ultrices euismod. "},
    {id: 2, charName: "Character - 2", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum placerat eros, at condimentum odio pretium et. Quisque pellentesque gravida tellus, eget sagittis est vulputate eu. Proin interdum vulputate eleifend. Donec laoreet id erat ac posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi lobortis hendrerit augue. In feugiat congue felis, eget luctus erat ultrices euismod. "},
    {id: 3, charName: "Character - 3", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum placerat eros, at condimentum odio pretium et. Quisque pellentesque gravida tellus, eget sagittis est vulputate eu. Proin interdum vulputate eleifend. Donec laoreet id erat ac posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi lobortis hendrerit augue. In feugiat congue felis, eget luctus erat ultrices euismod. "},
    {id: 4, charName: "Character - 4", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum placerat eros, at condimentum odio pretium et. Quisque pellentesque gravida tellus, eget sagittis est vulputate eu. Proin interdum vulputate eleifend. Donec laoreet id erat ac posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi lobortis hendrerit augue. In feugiat congue felis, eget luctus erat ultrices euismod. "}
];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected ' + rooms.length);
    socket.emit("get_rooms_sb", rooms);

    socket.on("create_room_bs", (...args) => {
        // TODO change username
        args[0].roomModel.users = [{id: socket.id, username: args[0].username, characterId: -1}];
        rooms.push(args[0].roomModel);
        socket.join(args[0].roomModel.room_name);
        socket.emit("change_page_sb", {page: "roomLobbyPage", room: args[0].roomModel.room_name, users:args[0].roomModel.users});
        io.emit("get_rooms_sb", rooms);
    });

    socket.on("join_room_bs", (...args) =>{
        socket.join(args[0].roomName);
        let joinedRoom = rooms.find((room)=>room.room_name === args[0].roomName);
        joinedRoom.users.push({id: socket.id, username: args[0].username, characterId: -1});
        socket.emit("change_page_sb", {page: "roomLobbyPage", room: args[0], users:joinedRoom.users});
        socket.to(args[0].roomName).emit("update_room_users_sb", joinedRoom.users );
    });

    socket.on("start_game_bs", (roomName) => {
        let joinedRoom = rooms.find((room)=>room.room_name === roomName);
        io.in(roomName).emit("start_game_sb", joinedRoom);
    });


    /**
     * signal_from: get_characters_bs
     * signal_to: get_characters_sb
     * sending character array (s -> nm)
     * */
    socket.on('get_characters_bs', () => {
        io.emit('get_characters_sb', characters);
    });

    /**
     * signal_from: set_character_bs
     * signal_to: set_character_sb
     * setCharObj: {roomName, currentUser, selectedCharId}
     * msgObj: {success, message}
     * */
    socket.on('set_character_bs', (setCharObj) => {
        console.log("SET CHARACTER: ");
        console.log(setCharObj);
        let roomName = setCharObj.roomName;
        let currentUser = setCharObj.currentUser;
        let selectedCharId = setCharObj.selectedCharId;

        let character = characters.find(char => char.id === selectedCharId);

        let roomIndex = rooms.findIndex(room => room.room_name === roomName);
        let userIndex = rooms[roomIndex].users.findIndex(user => currentUser.id === user.id);

        rooms[roomIndex].users[userIndex].characterId = selectedCharId;
        console.log(rooms[roomIndex].users);

        socket.emit('set_character_sb', {success: 1, message: "Your character is set to character with name " + character.charName});
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});