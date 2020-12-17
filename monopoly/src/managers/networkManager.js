const socketIOClient = require("socket.io-client");
const mainWindow = require("../../main").mainWindow;
class NetworkManager {
    constructor() {
        this.socket = socketIOClient("http://localhost:3000");
        this.rooms = [];
        this.socket.on("get_rooms_sb", (...args) => {
            console.log("main - get_rooms_sb");
            this.rooms = args[0];
            console.log("ROOMS: " + JSON.stringify(this.rooms,null,2));
            mainWindow.send("get_rooms_bf", this.rooms);
        });
        this.socket.on("change_page_sb", (...args) => {
            console.log("main - change_page_sb");
            this.currentUser = args[0].users.find((user)=>user.id === this.socket.id);
            this.rooms.find((room)=>room.room_name === args[0].room.roomName).users = args[0].users;
            console.log("ROOMS: " + JSON.stringify(this.rooms,null,2));
            console.log("CURRENTUSER: " + JSON.stringify(this.currentUser));
            mainWindow.send("change_page_bf", args[0]);
        });

        this.socket.on("update_room_users_sb", (...args) => {
            console.log("main - update_room_users_sb");
            mainWindow.send("update_room_users_bf", args[0]);
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

    joinRoom(args){
        console.log("EMIT ON NETWORK:" + args.roomName + " - " + args.username);
        this.socket.emit("join_room_bs", args);
    }
}

module.exports = new NetworkManager;