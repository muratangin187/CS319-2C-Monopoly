const PropertyModel = require("../models/propertyModel");

const {ipcMain} = require('electron');
const networkManager = require("./networkManager");
const playerManager = require("./playerManager");
const cardManager = require("./cardManager");
const EventManager = require("./eventManager");
const TradeManager = require("./tradeManager");
const StateManager = require("./stateManager");
let house_Count = 32;
let hotel_Count = 12;

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
        });
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
            let property = cardManager.getCardById(args[0]);
            playerManager.addProperty(user.id, property);
        });
        //same buildings, bidding commences and the buildings go to the highest bidder
        //we need to implement an auction for bidding houses and hotels
        /**
         * args = {propertyModelID, BuildingModel}
         */
        ipcMain.on("set_building_fb", (event, args)=>{
            const user = networkManager.getCurrentUser();
            let property = cardManager.getCardById(args[0]);

            let type = args[1].type;

            if(type === 'hotel' && hotel_Count === 0)
                    console.log("No hotel left to build");

            else if(type === 'house' && house_Count === 0)
                    console.log("No house left to build");

            else{
                let cond = playerManager.setBuildings(user.id, property, args[1]);

                if(!cond){
                    console.log("Cannot buy. Conditions not meet");
                }
                else{
                    console.log("Success");
                    if(type === 'hotel') {
                        hotel_Count -= 1;
                        house_Count += 4;
                    }

                    else
                        house_Count -= 1;
                }
            }
        });
        /**
         * args = {PropertyModelId, BuildingModel}
         */
        ipcMain.on("sell_building", (event, args)=>{
            const user = networkManager.getCurrentUser();
            let property = cardManager.getCardById(args[0]);

            let type = args[1].type;

            if(type === 'hotel' && hotel_Count === 12)
                console.log("All hotels are in the bank, there cannot be a hotel on the board.");

            else if(type === 'house' && house_Count === 32)
                console.log("All houses are in the bank, there cannot be a house on the board.");

            else {
                let cond = playerManager.sellBuilding(user.id, property, args[1]);

                if (cond) {
                    console.log("Building is removed successfully!");
                    if (type === 'hotel') {
                        hotel_Count += 1;
                    } else if (type === 'house') {
                        house_Count += 1;
                    }
                } else {
                    console.log('Failed to remove building due to an error.')
                }
            }
        });
        /**
         * channel: event name
         *
         * args = property
         */
        ipcMain.on("auction_fb", (event, args)=>{
            let players = playerManager.getPlayers();
            let newTrade = new TradeManager(players, args);

            StateManager.updateState(newTrade);
            /**
             * args = new Bid amount
             */
            ipcMain.on("getOffer_fb",(event, args)=>{
                let cond = newTrade.newBid(this.getCurrentUser(), args);

                if(!cond){
                    console.log("Please enter valuable amount");
                }
            });
            let winner = newTrade.closeTrade();
            /*
                If winner length is not zero. Finish the Trade
             */
            StateManager.updateState(newTrade);
        });

    }

}

module.exports = new GameManager();

