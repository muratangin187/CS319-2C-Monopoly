const {ipcMain} = require('electron');
const networkManager = require("./networkManager");

class GameManager{
    constructor() {
        this.createListeners();
    }

    createListeners(){
        ipcMain.on("create_room_fb", (event, args) => {
            networkManager.createRoom(args);
        })
        ipcMain.on("join_room_fb", (event, args)=>{
            networkManager.joinRoom(args);
        });
    }

}

module.exports = new GameManager;

