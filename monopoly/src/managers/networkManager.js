const socketIOClient = require("socket.io-client");

class NetworkManager {
    constructor() {
        this.socket = socketIOClient("http://localhost:3000");
        this.rooms = [];
        this.setRooms = (arg) => {
            this.rooms = arg;
        };
    }

    createRoom(roomModel){
        console.log("NetworkManager: " + JSON.stringify(roomModel));

        //send
        this.socket.emit("create_room_send", roomModel);

        console.log("Test-2")
        this.socket.once("create_room_response", (rooms) => {
            console.log("create_room_response is listened:");
            console.log(rooms);
            this.setRooms(rooms);
        });
    }

    getRooms(){
        console.log(this.rooms);
        return this.rooms;
    }
}

module.exports = new NetworkManager;