const socketIOClient = require("socket.io-client");
const mainWindow = require("../../main").mainWindow;
class NetworkManager {
    constructor() {
        this.socket = socketIOClient("http://localhost:3000");
        this.rooms = [];
        this.socket.on("get_rooms_sb", (...args) => {
            console.log("main - get_rooms_sb");
            console.log(args[0]);
            this.rooms = args[0];
            console.log("this.rooms");
            console.log(this.rooms);
            mainWindow.send("get_rooms_bf", this.rooms);
        });
        this.socket.on("change_page_sb", (...args) => {
            console.log("main - change_page_sb");
            mainWindow.send("change_page_bf", args[0]);
        });

        this.socket.on("update_room_users_sb", (...args) => {
            console.log("main - update_room_users_sb");
            mainWindow.send("update_room_users_bf", args[0]);
        });
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