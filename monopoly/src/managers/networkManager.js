const socketIOClient = require("socket.io-client");
const mainWindow = require("../../main").mainWindow;
const GameManager = require("./gameManager");
class NetworkManager {
    constructor() {
        this.socket = socketIOClient("http://localhost:3000");
        this.rooms = [];
        this.socket.on("start_game_sb", (roomObject)=>{
            mainWindow.send("start_game_bf", roomObject);
        });
        this.socket.on("get_rooms_sb", (...args) => {
            console.log("main - get_rooms_sb");
            this.rooms = args[0];
            console.log("ROOMS: " + JSON.stringify(this.rooms,null,2));
            mainWindow.send("get_rooms_bf", this.rooms);
        });
        this.socket.on("change_page_sb", (...args) => {
            console.log("main - change_page_sb");
            this.currentUser = args[0].users.find((user)=>user.id === this.socket.id);
            if(args[0].room.roomName)
                this.currentUser.roomName = args[0].room.roomName;
            else
                this.currentUser.roomName = args[0].room;
            if(this.rooms.find((room)=>room.room_name === args[0].room.roomName))
                this.rooms.find((room)=>room.room_name === args[0].room.roomName).users = args[0].users;
            console.log("ROOMS: " + JSON.stringify(this.rooms,null,2));
            console.log("CURRENTUSER: " + JSON.stringify(this.currentUser));
            mainWindow.send("change_page_bf", {result:args[0], currentUser: this.currentUser});
        });

        this.socket.on("update_room_users_sb", (...args) => {
            console.log("main - update_room_users_sb");
            mainWindow.send("update_room_users_bf", args[0]);
        });

        this.socket.on("move_player_sb", (args) => {
            console.log("main - move_player_sb");
            let playerId = args.playerId;
            let destinationTileId = args.destinationTileId;
            console.log("NetworkManager USER: " + playerId + " moved to tile " + destinationTileId);
            GameManager.moveOtherPlayer(playerId, destinationTileId);
            //mainWindow.send("move_player_bf", {playerId, destinationTileId});
        });
    }

    getRoom(roomName){
        return this.rooms.find((room) => room.room_name === roomName);
    }

    getCurrentUser(){
        return this.currentUser;
    }

    createRoom(args) {
        this.socket.emit("create_room_bs", args);
    }

    startGame(roomName){
        this.socket.emit("start_game_bs", roomName);
    }

    joinRoom(args){
        console.log("EMIT ON NETWORK:" + args.roomName + " - " + args.username);
        this.socket.emit("join_room_bs", args);
    }

    movePlayer(userId, destinationTileId){
        console.log("NETWORK MANAGER: " + userId + " to " + destinationTileId + " in " + this.currentUser.roomName);
        this.socket.emit("move_player_bs", {playerId:userId, destinationTileId:destinationTileId, roomName:this.currentUser.roomName});
    }
}

module.exports = new NetworkManager();