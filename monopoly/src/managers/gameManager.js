const {ipcMain} = require('electron');
// import NetworkManager from "./networkManager";
const networkManager = require("./networkManager");

class GameManager{
    constructor() {
        this.createListeners();
    }

    createListeners(){
        ipcMain.on('create_room', (event, arg) => {
            //listen create_room
            console.log("GameManager: " + JSON.stringify(arg));
            networkManager.createRoom(arg);
            console.log("GetRooms:")
            console.log(networkManager.getRooms());
            event.returnValue = networkManager.getRooms();
        });
    }
}

module.exports = new GameManager;

