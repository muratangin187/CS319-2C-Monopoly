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

let properties = [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 37, 39];
let chance = [7, 22, 36];
let communityChest = [2, 17, 33];
let goJail = 30;
let incomeTax = 4;

let chanceUsableCards = [16, 17, 6];
let chestUsableCards = [4];


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
            //ToDO
            /*
                If winner length is not zero. Finish the Trade
             */
            StateManager.updateState(newTrade);
        });


        /**
         * args: {newTile:number, }
         */
        ipcMain.on('new_tile', (event, args)=>{
            let players = playerManager.getPlayers();
            let currentUser = networkManager.getCurrentUser();

            //get the player id
            let playerId = currentUser.id;

            //current tile of the player before moving
            let oldTile = players[playerId].currentTile;
            let newTile = args[0]

            let startBonus = false;
            if (oldTile <= 39 && newTile >= 0) {
                startBonus = true;
            }

            playerManager.move(currentUser, newTile, startBonus);

            // if new tile is jail
            if (newTile !== goJail) {
                //ToDo
                //Here call the function which the player is sent to jail to wait 3 turns
            }

            //if tile is income, player spends $200 or 10% of his/her money
            else if (newTile === incomeTax) {
                playerManager.setMoney(playerId, -200);
            }

            //traverse the arrays in order to find the tile type
            else {
                let typeTile = -1;
                let found = false;
                for (let i = 0; i < properties.length; i++) {
                    if (properties[i] === newTile) {
                        typeTile = 0;
                        found = true;
                        break;
                    }
                }

                //if tile type is found, no need to traverse other arrays
                if (!found) {
                    for (let i = 0; i < chance.length; i++) {
                        if (chance[i] === newTile) {
                            typeTile = 1;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        for (let i = 0; i < communityChest.length; i++) {
                            if (communityChest[i] === newTile) {
                                typeTile = 2;
                                found = true;
                                break;
                            }
                        }
                    }
                }

                //arrays are traversed, do what needs to be done after moving to a new tile
                if (typeTile === 0) {
                    let property = cardManager.getCardById(args[0]);
                    if (property.ownerId == null) {
                        //ToDo
                        //depending on whether the user chooses to buy or not, give tile to user start an auction

                        //give tile if no auction
                        playerManager.addProperty(playerId, property);
                    }

                }
                else if (typeTile === 1) {
                    //ToDo
                    //Draw a chance card
                    // let chanceCard = cardManager.
                }
                else if (typeTile === 2) {
                    //ToDo
                    //Draw a community chest card
                    // let communityCard = cardManager.
                }
                else {
                    console.log("Cannot find the type of the newTile. Debug.");
                }
            }
        });
        //ToDo
        //ipcMain.on('moveResult', (event, args)=>{
           //let property = ....;
           //property => Satin alinabilecek
           //if(property.ownerID !== PlayerID){
               //pay rent
                    //!== null
                //payRent
               // buy land
                /*
                2 secenek
                1. secenek -> satin al
                2. secenek -> auction
                //event Yaratilir
                bu eventi yolla
                 */
           //}

        //});
        //ToDo : listener eleman almasa olur mu
        ipcMain.on("useCardToExit_fb", () =>{
            let currentUser = networkManager.getCurrentUser();

            let cond = this.useCardToExitJail(currentUser.id);

            if(cond){
                //ToDo for Each rollDice and Move
                //rollDice();
                //move();
            }
        });
        //ToDo : listener eleman almasa olur mu
        ipcMain.on("payToExit_fb", () =>{
            let currentUser = networkManager.getCurrentUser();

            let cond = this.payToExitJail(currentUser.id);

            if(cond){
                //rollDice();
                //move();
            }
        });
        //ToDo : listener eleman almasa olur mu
        ipcMain.on("rollToExit_fb", () =>{
            let currentUser = networkManager.getCurrentUser();

            //let {x,y} = rollDice();

            let cond = this.rollToExitJail(currentUser.id);

            if(cond){
               //move(x, y);
            }
            else{
                //while(!choose(pay, use)){}

                //move(x, y);
            }
        });

        /**
         * signal_from: get_characters_fb
         * */
        ipcMain.on('get_characters_fb', (event, args) => {
            networkManager.getCharacters();
        });

        /**
         * signal_from: get_character_sb
         * setCharObj: {roomName, currentUser, selectedCharId}
         * */
        ipcMain.on('set_character_fb', (event, setCharObj) => {
           networkManager.setCharacter(setCharObj);
        });
    }

    rollToExitJail(currentUser){
        if(x === y)
            playerManager.exitJail(currentUser);

        else{
            if(playerManager.getJailLeft(currentUser) > 0)
                playerManager.reduceJailLeft(currentUser);

            else
                return false;

        }

        return true;
    }

    payToExitJail(currentUser){
        let amount = 50;

        return playerManager.setMoney(currentUser, -amount);
    }

    useCardToExitJail(currentUser){
        let chanceCardID = 6;
        let chestCardID = 4;
        let cond1 = playerManager.useCard(currentUser, chanceCardID);

        if(cond1){
            cardManager.addChanceCard(chanceCardID, "Get Out of Jail Free");
            playerManager.exitJail(currentUser);

            return true;
        }
        else{
            let cond2 = playerManager.useCard(currentUser, chestCardID);

            if(cond2) {
                cardManager.addChestCard(chestCardID, "Get Out of Jail Free");
                playerManager.exitJail(currentUser);

                return true;
            }
        }

        return false;
    }

    /**
     * Send Current User to the Jail
     */
    goJail(playerID){
        playerManager.sendJail(playerID);
    }

    drawChestCard(playerID){
        let card = cardManager.drawChestCard();

        if(!chestUsableCards.includes(card.id)){
            cardManager.addChestCard(card.id, card.description);

            // TODO Apply the Card Effect
        }
        else
            playerManager.addCard(playerID, card);
    }

    drawChanceCard(playerID){
        let card = cardManager.drawChanceCard();

        if(!chanceUsableCards.includes(card.id)){
            cardManager.addChanceCard(card.id, card.description);

            // TODO Apply the Card Effect
        }
        else
            playerManager.addCard(playerID, card);
    }
}

module.exports = new GameManager();

