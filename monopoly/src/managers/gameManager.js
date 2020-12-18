const PropertyModel = require("../models/propertyModel");

const {ipcMain} = require('electron');
const networkManager = require("./networkManager");
const playerManager = require("./playerManager");
const cardManager = require("./cardManager");
const EventManager = require("./eventManager");

class GameManager{
    constructor() {
        this.createListeners();
    }

    getCurrentUser(){
        return networkManager.getCurrentUser();
    }

    createListeners(){
        ipcMain.on("create_room_fb", (event, args) => {
            networkManager.createRoom(args);
        })
        ipcMain.on("join_room_fb", (event, args)=>{
            networkManager.joinRoom(args);
        });
        ipcMain.on("start_game_fb", (event, args)=>{
            let room = networkManager.getRoom(args);
            playerManager.createPlayers(room.users);
            cardManager.setCards([
                new PropertyModel(0, "Ankara", 10, 1, 100, 2, 0),
                new PropertyModel(1, "Konya", 10, 1, 3, 2, 0)
            ]);
            networkManager.startGame(args);
        });
        ipcMain.on("buy_property_fb", (event, args)=>{
            const user = networkManager.getCurrentUser();
            let property = cardManager.getCardById(args);
            playerManager.addProperty(user.id, property);
        });

        //ipcMain.on();
    }

}

module.exports = new GameManager();

