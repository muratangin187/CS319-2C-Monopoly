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
    }

    createRoom(roomModel) {
        this.socket.emit("create_room_bs", roomModel);
    }

    getRooms(){
        return new Promise((resolve, reject) => {
            this.socket.emit("get_rooms_bs");
            this.socket.once("get_rooms_sb", (...args) => {
                console.log("main - get_rooms_sb");
                console.log(args[0]);
                this.rooms = args[0];
                console.log("this.rooms");
                console.log(this.rooms);
                resolve(this.rooms);
            });
        });
    }
}

module.exports = new NetworkManager;