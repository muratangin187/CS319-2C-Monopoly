const PropertyModel = require("../models/propertyModel");

const {ipcMain} = require('electron');
const mainWindow = require("../../main").mainWindow;
const networkManager = require("./networkManager");
const viewManager = require("./viewManager");
const playerManager = require("./playerManager");
const cardManager = require("./cardManager");
const EventManager = require("./eventManager");
const TradeManager = require("./tradeManager");
const StateManager = require("./stateManager");
const Globals = require("../globals");
const ModelManager = require("./modelManager");
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
        networkManager.setStateListener(this.stateTurn);
        networkManager.setStartGameListener(this.startGameListenerCallback);
        networkManager.setMoveListener(this.moveListener);
        networkManager.setUpdatePlayerListener(this.updatePlayerListener);
        networkManager.setUpdatePropertyListener(this.updatePropertiesListener);
    }

    getCurrentUser(){
        return networkManager.getCurrentUser();
    }

    updatePlayerListener(players){
        players.forEach(newPlayerModel=>{
            let oldPlayerModel = playerManager.getPlayers()[newPlayerModel.id];
            if(newPlayerModel.money > oldPlayerModel.money){
                let diff = newPlayerModel.money - oldPlayerModel.money;
                mainWindow.send("show_notification", {message: "You earn " + diff + "$.", intent: "success"});
            }else if(newPlayerModel.money < oldPlayerModel.money){
                if(newPlayerModel.id === networkManager.getCurrentUser().id){
                    let diff = oldPlayerModel.money - newPlayerModel.money;
                    mainWindow.send("show_notification", {message: "You paid " + diff + "$.", intent: "danger"});
                }
            }
            console.log("Player " + newPlayerModel.username + " money(old,new): " + oldPlayerModel.money + ", " + newPlayerModel.money);
            // TODO CHECK ALL THE PROPERTIES AND REFLECT THEM TO VIEW
            // TODO DO THIS FOR OTHER PROPERTIES MIGHT BE CHANGE
            playerManager.getPlayers()[newPlayerModel.id].money = newPlayerModel.money;
        });
    }

    updatePropertiesListener(properties){
        properties.forEach(newPropertyModel=>{
            ModelManager.getModels()[newPropertyModel.id].ownerId = newPropertyModel.ownerId;
            ModelManager.getModels()[newPropertyModel.id].isMortgaged= newPropertyModel.isMortgaged;
            console.log("Property name: " + newPropertyModel.name + " was bought by " + newPropertyModel.ownerId);
            // TODO CHECK ALL THE PROPERTIES AND REFLECT THEM TO VIEW
        });
    }

    moveListener(args){
        let playerId = args.playerId;
        let destinationTileId = args.destinationTileId;
        playerManager.getPlayers()[playerId].currentTile = destinationTileId;
        mainWindow.send("bm_move" , {playerId, destinationTileId});
    }

    startGameListenerCallback(room){
        playerManager.createPlayers(room.users);
        cardManager.setCards([
            new PropertyModel(0, "Ankara", 10, 1, 100, 2, 0),
            new PropertyModel(1, "Konya", 10, 1, 3, 2, 0)
        ]);
        //for(let model in ModelManager.getModels()){
        //    ModelManager.getModels()[model].setOwner(room.users[0].id);
        //}
        mainWindow.send("bm_initializeGame" , playerManager.getPlayers());
    }

    createListeners(){
        ipcMain.on("create_room_fb", (event, args) => {
            networkManager.createRoom(args);
        });
        ipcMain.on("updateTilesAndModels", (event, args)=>{
            this.tiles = args.tiles;
            this.models = args.models;
            console.log("TILES UPDATED: " + JSON.stringify(this.tiles, null, 2));
        });
        ipcMain.on("join_room_fb", (event, args)=>{
            networkManager.joinRoom(args);
        });
        ipcMain.on("start_game_fb", (event, args)=>{
            networkManager.startGame(args);
        });
        ipcMain.on("buy_property_fb", (event, propertyModel)=>{
            const user = networkManager.getCurrentUser();
            propertyModel = ModelManager.getModels()[propertyModel.id];
            if(playerManager.addProperty(user.id, propertyModel)){
                // ALDI
                mainWindow.send("show_notification", {message: "You bought " + propertyModel.name + ".", intent: "success"});
                mainWindow.send("bm_updateCard", playerManager.getPlayers()[networkManager.getCurrentUser().id]);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
                networkManager.updateProperties([propertyModel]);
            }else{
                // PARA YOK
                mainWindow.send("show_notification", {message: "You dont have enough money to buy " + propertyModel.name + ".", intent: "danger"});
            }
            networkManager.nextState();
        });
        ipcMain.on("determineStartOrder_fb", (event, sum)=>{
            networkManager.determineStartOrder(sum);
        });
        ipcMain.on("move_player_fb", (event, rolledDice)=>{
            console.log("NETWORKMANAGER CURRENT: ");
            console.log(networkManager.getCurrentUser());
            console.log("PLAYERMANAGER ALL:");
            console.log(playerManager.getPlayers());
            let currentTile = playerManager.getPlayers()[networkManager.getCurrentUser().id].currentTile;
            let destinationTileId = (currentTile + rolledDice[0] + rolledDice[1]) % ((Globals.tileNumber-1) * 4);
            if(rolledDice[0] === rolledDice[1]){
                // double rolled
                if(playerManager.increaseDoubleCount(networkManager.getCurrentUser().id)){
                    // goto jail
                    destinationTileId = Globals.tileNumber-1;
                    playerManager.sendJail(networkManager.getCurrentUser().id);
                }
            }else{
                playerManager.resetDoubleCount(networkManager.getCurrentUser().id);
            }
            networkManager.movePlayer(destinationTileId);
            playerManager.getPlayers()[networkManager.getCurrentUser().id].currentTile = destinationTileId;
            if(playerManager.isInJail(networkManager.getCurrentUser().id)){
                // set state to jail screen
                Globals.isDouble = false;
                this.stateTurn({stateName: "playNormalTurn", payload:{}});
            }else{
                if(rolledDice[0] === rolledDice[1]) {
                    Globals.isDouble = true;
                }else{
                    Globals.isDouble = false;
                }
                // set state to according to tile
                // TODO quest check
                console.log("WENT TO NEW TILE: " + destinationTileId);
                // TODO call stateTurn according to new tile
                console.log("THIS.TILES: " + JSON.stringify(Globals.tiles, null, 2));
                let currentTile = Globals.tiles.find(tile=> tile.tile === destinationTileId);
                switch(currentTile.type){
                    case "CornerTile":
                        break;
                    case "StationTile":
                        break;
                    case "UtilityTile":
                        break;
                    case "CityTile":
                        let cityModel = ModelManager.getModels()[currentTile.tile];
                        let ownerOfCityId = cityModel.getOwner();
                        if(ownerOfCityId){
                            if(ownerOfCityId === networkManager.getCurrentUser().id){
                                // BU CITY BIZIM
                                console.log("BU BENIM CITYM");
                            }else{
                                // BU CITY BASKASININ
                                console.log("BU BASKASININ CITYSI");
                                let rentPrice = cityModel.getRentPrice();
                                let double = true;
                                for(let model in ModelManager.getModels()){
                                    if(ModelManager.getModels()[model].color && ModelManager.getModels()[model].color === cityModel.color){
                                        if(ModelManager.getModels()[model].ownerId !== cityModel.ownerId){
                                            double = false;
                                        }
                                    }
                                }
                                if(double){
                                    rentPrice = rentPrice * 2;
                                }
                                playerManager.setMoney(networkManager.getCurrentUser().id, -rentPrice);
                                playerManager.setMoney(ownerOfCityId, rentPrice);
                                console.log("Your price: " + playerManager.getMoney(networkManager.getCurrentUser().id));
                                console.log(playerManager.getPlayers()[ownerOfCityId].username + " price: " + playerManager.getMoney(ownerOfCityId));
                                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id], playerManager.getPlayers()[ownerOfCityId]]);
                                networkManager.nextState();
                            }
                        }else{
                            // BU CITY ALINMAMIS
                            this.stateTurn({stateName: "buyNewProperty", payload: cityModel});
                        }
                        break;
                    case "SpecialTile":
                        break;
                    default:
                        console.log("Wrong tile type");
                        break;
                }
            }
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
        ipcMain.on("useCardToExit_fb", () =>{
            let currentUser = networkManager.getCurrentUser();

            let cond = this.useCardToExitJail(currentUser.id);

            if(cond){
                //ToDo for Each rollDice and Move
                //rollDice();
                //move();
            }
        });
        ipcMain.on("payToExit_fb", () =>{
            let currentUser = networkManager.getCurrentUser();

            let cond = this.payToExitJail(currentUser.id);

            if(cond){
                //rollDice();
                //move();
            }
        });
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


    }

    stateTurn(stateObject){
        let stateName = stateObject.stateName;
        let payload = stateObject.payload;
        //console.log("NEXT STATE: " + stateName + " PAYLOAD: " + JSON.stringify(payload));
        switch (stateName) {
            case "playNormalTurn":
                if(playerManager.isInJail(networkManager.getCurrentUser().id)){
                }else{
                   mainWindow.send("next_state_bf", {stateName:"playNormalTurn", payload: payload});
                }
                break;
            case "waitOtherPlayerTurn":
                mainWindow.send("next_state_bf", {stateName:"waitOtherPlayerTurn", payload: payload});
                break;
            case "buyNewProperty":
                mainWindow.send("next_state_bf", stateObject);
                break;
            default:
                console.log("GIRMEMEN LAZIMDI");
                break;
        }
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


    mortgage(playerID, property){
        playerManager.mortgage(playerID, property);
    }

    liftMortgage(playerID, property){
        playerManager.liftMortgage(playerID,property);
    }
}

module.exports = new GameManager();

