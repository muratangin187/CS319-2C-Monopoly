const socketIOClient = require("socket.io-client");

class NetworkManager {
    constructor() {
        this.socket = socketIOClient("http://localhost:3000");

        //response
        this.socket.on("create_room_on", arg => {
            console.log("SocketIO Response: " + arg);
        });
    }

    createRoom(roomModel){
        console.log("NetworkManager: " + JSON.stringify(roomModel));

        //send
        this.socket.emit("create_room_emit", roomModel);
    }
}

module.exports = new NetworkManager;