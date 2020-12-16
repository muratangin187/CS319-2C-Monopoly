const {ipcMain} = require('electron');
// import NetworkManager from "./networkManager";
const networkManager = require("./networkManager");

class GameManager{
    constructor() {
        this.createListeners();
    }

    createListeners(){

        ipcMain.on("get_rooms_fb", async (event, args) => {
            let rooms = await networkManager.getRooms();
            console.log("game manager - from network manager");
            console.log(rooms);
            event.reply("get_rooms_bf", rooms);
        });

        ipcMain.on("create_room_fb", (event, args) => {
            networkManager.createRoom(args);
        })
    }
}

module.exports = new GameManager;

