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
let ModelManager;
let house_Count = 32;
let hotel_Count = 12;

let properties = [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 37, 39];
let chance = [7, 22, 36];
let communityChest = [2, 17, 33];
let goJail = 30;
let incomeTax = 4;

let chanceUsableCards = [16, 17, 6];
let chestUsableCards = [4];

let questComb = [];
let diceComb = [];

class GameManager{
    constructor() {
        this.createListeners();
        networkManager.setStateListener(this.stateTurn.bind(this));
        networkManager.setStartGameListener(this.startGameListenerCallback);
        networkManager.setMoveListener(this.moveListener);
        networkManager.setUpdatePlayerListener(this.updatePlayerListener);
        networkManager.setUpdatePropertyListener(this.updatePropertiesListener);
        networkManager.setAuctionListener(this.auctionListener);

        for( let i = 0; i < 5; i++){
            let x = this.getRandomInt(1,6);
            let y = this.getRandomInt(1,6);
            let dice = {x: x, y: y};
            diceComb.push(dice);
        }

        for( let i = 0; i < 5; i++){
            let x = this.getRandomInt(0, 40);
            let loc = {id: x};
            questComb.push(loc);
        }
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    getCurrentUser(){
        return networkManager.getCurrentUser();
    }

    auctionListener(winnerId, propertyModel, bidAmount, auctionStarter){
        let currentProperty = ModelManager.getModels()[propertyModel.id];
        let oldOwner = currentProperty.ownerId;
        if(currentProperty.ownerId){
            let x = currentProperty.ownerId;
            console.log(currentProperty.ownerId);
            playerManager.removeProperty(currentProperty.ownerId, currentProperty);
        }
        let winnerPlayer = playerManager.getPlayers()[winnerId];
        playerManager.setMoney(winnerId, -bidAmount);
        currentProperty.setOwner(winnerId);
        winnerPlayer.properties.push(currentProperty);
        if(networkManager.getCurrentUser().id === oldOwner){
            playerManager.setMoney(oldOwner, bidAmount);
            mainWindow.send("update_money_indicator", playerManager.getMoney(oldOwner));
            mainWindow.send("bm_updateCard", playerManager.getPlayers()[oldOwner]);
            networkManager.updatePlayers([playerManager.getPlayers()[oldOwner]]);
        }
        if(networkManager.getCurrentUser().id === winnerId){
            mainWindow.send("update_money_indicator", winnerPlayer.money);
            mainWindow.send("bm_updateCard", playerManager.getPlayers()[winnerId]);
            mainWindow.send("show_notification", {message: "You win auction for " + propertyModel.name + ".", intent: "success"});
            networkManager.updatePlayers([playerManager.getPlayers()[winnerId]]);
        }
        if(networkManager.getCurrentUser().id === auctionStarter) {
            networkManager.nextState();
        }
        console.log(playerManager.getPlayers());
    }

    updatePlayerListener(players){
        players.forEach(newPlayerModel=>{
            let oldPlayerModel = playerManager.getPlayers()[newPlayerModel.id];
            if(newPlayerModel.money > oldPlayerModel.money){
                if(newPlayerModel.id === networkManager.getCurrentUser().id){
                    let diff = newPlayerModel.money - oldPlayerModel.money;
                    mainWindow.send("show_notification", {message: "You earn " + diff + "$.", intent: "success"});
                }
            }else if(newPlayerModel.money < oldPlayerModel.money){
                let diff = oldPlayerModel.money - newPlayerModel.money;
                if(newPlayerModel.id === networkManager.getCurrentUser().id) {
                    mainWindow.send("show_notification", {message: "You paid " + diff + "$.", intent: "danger"});
                }
            }
            if(newPlayerModel.id === networkManager.getCurrentUser().id){
                mainWindow.send("updatePlayerList", playerManager.getPlayers());
                mainWindow.send("update_money_indicator", newPlayerModel.money);
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
            console.log("Property name: " + newPropertyModel.name + " was bought by " + newPropertyModel.ownerId + " - " + ModelManager.getModels()[newPropertyModel.id].type);
            if(ModelManager.getModels()[newPropertyModel.id].type === "CityModel"){
                console.log(newPropertyModel.buildings.hotel + " - " + newPropertyModel.buildings.house);
                ModelManager.getModels()[newPropertyModel.id].buildings.house = newPropertyModel.buildings.house;
                ModelManager.getModels()[newPropertyModel.id].buildings.hotel = newPropertyModel.buildings.hotel;
                mainWindow.send("updatePlayerList", playerManager.getPlayers());
                mainWindow.send("bm_updateCity", {id: newPropertyModel.id, house: newPropertyModel.buildings.house, hotel: newPropertyModel.buildings.hotel});
            }
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
        ModelManager = require("./modelManager");
        mainWindow.send("updatePlayerList", playerManager.getPlayers());
        //for(let model in ModelManager.getModels()){
        //    ModelManager.getModels()[model].setOwner(room.users[0].id);
        //}
        let names = {};
        let colors = {};
        for(let index in ModelManager.getModels()){
            names[index] = (ModelManager.getModels()[index].name);
            colors[index] = (ModelManager.getModels()[index].color);
        }
        mainWindow.send("bm_initializeGame" , {players:playerManager.getPlayers(),names: names, colors: colors} );
    }

    moveAction(destinationTileId){
        networkManager.movePlayer(destinationTileId);
        let oldTile = playerManager.getPlayers()[networkManager.getCurrentUser().id].currentTile;
        playerManager.getPlayers()[networkManager.getCurrentUser().id].currentTile = destinationTileId;
        if(playerManager.isInJail(networkManager.getCurrentUser().id)){
            // set state to jail screen
            Globals.isDouble = false;
            let turnsLeft = playerManager.getJailLeft(networkManager.getCurrentUser().id);
            if(turnsLeft === 0){
                playerManager.exitJail(networkManager.getCurrentUser().id);
                this.stateTurn({stateName: "playNormalTurn", payload:{}});
            }else{
                playerManager.reduceJailLeft(networkManager.getCurrentUser().id);
                let jailCard = playerManager.searchCard(networkManager.getCurrentUser().id, 6);
                if(!jailCard)
                    jailCard = playerManager.searchCard(networkManager.getCurrentUser().id, 4);
                if(jailCard)
                    this.stateTurn({stateName: "playNormalTurn", payload:{turnsLeft: turnsLeft,haveCard: true}});
                else
                    this.stateTurn({stateName: "playNormalTurn", payload:{turnsLeft: turnsLeft,haveCard: false}});
            }
        }else{
            // set state to according to tile
            console.log("WENT TO NEW TILE: " + destinationTileId);
            // TODO call stateTurn according to new tile
            //console.log("THIS.TILES: " + JSON.stringify(Globals.tiles, null, 2));
            let currentTile = Globals.selectedTileId === 1 ? Globals.tiles.find(tile=> tile.tile === destinationTileId) : Globals.tiles2.find(tile=> tile.tile === destinationTileId);
            switch(currentTile.type){
                case "CornerTile":
                    if(destinationTileId === 30){
                        playerManager.sendJail(networkManager.getCurrentUser().id);
                        Globals.isDouble = false;
                        mainWindow.send("show_notification", {message: "You entered jail.", intent: "danger"});
                        setTimeout(()=>{
                            networkManager.movePlayer(10);
                            networkManager.nextState();
                        },2000);
                    }else{
                        networkManager.nextState();
                    }
                    break;
                case "StationTile":
                    let stationModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfStationId = stationModel.getOwner();
                    if(ownerOfStationId){
                        if(ownerOfStationId === networkManager.getCurrentUser().id){
                            // BU CITY BIZIM
                            console.log("BU BENIM STATIONU");
                            networkManager.nextState();
                        }else{
                            // BU CITY BASKASININ
                            console.log("BU BASKASININ STATIONU");
                            let rentPrice = stationModel.getRentPrice();
                            let counter = 0;
                            for(let i=0; i<4; i++){
                                if(ModelManager.getModels()[(5 + (10*i))].ownerId === stationModel.ownerId){
                                    counter++;
                                }
                            }
                            rentPrice = rentPrice * counter;
                            let cond = playerManager.setMoney(networkManager.getCurrentUser().id, -rentPrice);
                            if(!cond){
                                mainWindow.send("show_notification", {message: "You need to sell property", intent: "danger"});
                                mainWindow.send("next_state_bf", {stateName: "SellState", payload: {}});
                                cond = playerManager.setMoney(networkManager.getCurrentUser().id, -rentPrice);
                            }

                            playerManager.setMoney(ownerOfStationId, rentPrice);
                            console.log("Your price: " + playerManager.getMoney(networkManager.getCurrentUser().id));
                            mainWindow.send("show_notification", {message: "You paid " + rentPrice + "$.", intent: "danger"});
                            console.log(playerManager.getPlayers()[ownerOfStationId].username + " price: " + playerManager.getMoney(ownerOfStationId));
                            networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id], playerManager.getPlayers()[ownerOfStationId]]);
                            networkManager.nextState();
                        }
                    }else{
                        // BU CITY ALINMAMIS
                        this.stateTurn({stateName: "buyNewProperty", payload: stationModel});
                    }
                    break;
                case "UtilityTile":
                    let utilityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfUtilityId = utilityModel.getOwner();
                    if(ownerOfUtilityId){
                        if(ownerOfUtilityId === networkManager.getCurrentUser().id){
                            // BU CITY BIZIM
                            console.log("BU BENIM UTILITY");
                            networkManager.nextState();
                        }else{
                            // BU CITY BASKASININ
                            console.log("BU BASKASININ UTILITYSI");
                            let counter = 0;
                            if(ModelManager.getModels()[12].ownerId === utilityModel.ownerId){
                                counter++;
                            }
                            if(ModelManager.getModels()[28].ownerId === utilityModel.ownerId){
                                counter++;
                            }
                            if(counter === 1){
                                counter = 4;
                            }else{
                                counter = 10;
                            }
                            let rentPrice = (destinationTileId - oldTile) * counter;
                            let cond = playerManager.setMoney(networkManager.getCurrentUser().id, -rentPrice);
                            if(!cond){
                                mainWindow.send("show_notification", {message: "You need to sell property", intent: "danger"});
                                mainWindow.send("next_state_bf", {stateName: "SellState", payload: {}});
                                cond = playerManager.setMoney(networkManager.getCurrentUser().id, -rentPrice);
                            }


                            playerManager.setMoney(ownerOfUtilityId, rentPrice);
                            console.log("Your price: " + playerManager.getMoney(networkManager.getCurrentUser().id));
                            mainWindow.send("show_notification", {message: "You paid " + rentPrice + "$.", intent: "danger"});
                            console.log(playerManager.getPlayers()[ownerOfUtilityId].username + " price: " + playerManager.getMoney(ownerOfUtilityId));
                            networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id], playerManager.getPlayers()[ownerOfUtilityId]]);
                            networkManager.nextState();
                        }
                    }else{
                        // BU CITY ALINMAMIS
                        this.stateTurn({stateName: "buyNewProperty", payload: utilityModel});
                    }
                    break;
                case "CityTile":
                    let cityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfCityId = cityModel.getOwner();
                    if(ownerOfCityId){
                        if(ownerOfCityId === networkManager.getCurrentUser().id){
                            // BU CITY BIZIM
                            console.log("BU BENIM CITYM");
                            networkManager.nextState();
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
                            let cond = playerManager.setMoney(networkManager.getCurrentUser().id, -rentPrice);
                            if(!cond){
                                mainWindow.send("show_notification", {message: "You need to sell property", intent: "danger"});
                                mainWindow.send("next_state_bf", {stateName: "SellState", payload: {}});

                                cond = playerManager.setMoney(networkManager.getCurrentUser().id, -rentPrice);
                            }

                            playerManager.setMoney(ownerOfCityId, rentPrice);
                            console.log("Your price: " + playerManager.getMoney(networkManager.getCurrentUser().id));
                            mainWindow.send("show_notification", {
                                message: "You paid " + rentPrice + "$.",
                                intent: "danger"
                            });
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
                    // let chance = [7, 22, 36];
                    // let communityChest = [2, 17, 33];

                    if((destinationTileId) === 7 ||(destinationTileId) === 22 ||(destinationTileId) === 36){
                        this.drawChanceCard(networkManager.getCurrentUser().id, destinationTileId);
                    }

                    else if((destinationTileId) === 17 ||(destinationTileId) === 2 ||(destinationTileId) === 33){
                        this.drawChestCard(networkManager.getCurrentUser().id, destinationTileId);
                    }

                    else if(destinationTileId === 4){
                        playerManager.setMoney(networkManager.getCurrentUser().id, -200);
                        mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                        networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
                    }else if(destinationTileId === 38){
                        playerManager.setMoney(networkManager.getCurrentUser().id, -100);
                        mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                        networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
                    }

                    networkManager.nextState();
                    break;
                default:
                    console.log("Wrong tile type");
                    break;
            }
        }
        // networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
        // networkManager.nextState();
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

        ipcMain.on("sell_fb", args=>{
            mainWindow.send("next_state_bf", {stateName: "SellStateNormal", payload: {}});

            Globals.isDouble = true;
        });
        ipcMain.on("goBack_fb", args=>{
           Globals.isDouble = true;
           console.log("FGIRDI");
           mainWindow.send("next_state_bf", {stateName: "playNormalTurn", payload: {}});

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
                networkManager.nextState();
            }else{
                // PARA YOK
                mainWindow.send("show_notification", {message: "You dont have enough money to buy " + propertyModel.name + ".", intent: "danger"});
                networkManager.setAuction(propertyModel, 0);
            }
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
            if(destinationTileId !== (currentTile + rolledDice[0] + rolledDice[1])){
                if(playerManager.isInJail(networkManager.getCurrentUser().id)){

                }else{
                    playerManager.setMoney(networkManager.getCurrentUser().id, 200);
                    mainWindow.send("update_money_indicator", playerManager.getMoney(networkManager.getCurrentUser().id).money);
                    mainWindow.send("show_notification", {message: "You gain 200$ from passing starting tile.", intent: "primary"});
                }
            }
            if(rolledDice[0] === rolledDice[1]){
                // double rolled
                if(playerManager.increaseDoubleCount(networkManager.getCurrentUser().id)){
                    // goto jail
                    destinationTileId = Globals.tileNumber-1;
                    playerManager.sendJail(networkManager.getCurrentUser().id);
                    networkManager.movePlayer(destinationTileId);
                    Globals.isDouble = false;
                    mainWindow.send("show_notification", {message: "You entered jail.", intent: "danger"});
                    networkManager.nextState();
                    return;
                }
            }else{
                playerManager.resetDoubleCount(networkManager.getCurrentUser().id);
            }
            Globals.isDouble = rolledDice[0] === rolledDice[1];

            if(questComb.forEach(quest => {if(quest.id === destinationTileId) return true;}))
                if(diceComb.forEach(dice => {
                    if(dice.x === rolledDice[0] && dice.y === rolledDice[1] ||
                        dice.y === rolledDice[0] && dice.x === rolledDice[1])
                        return true;}))
                    playerManager.setMoney(networkManager.getCurrentUser().id, 600);

            this.moveAction(destinationTileId);
        });
        //same buildings, bidding commences and the buildings go to the highest bidder
        //we need to implement an auction for bidding houses and hotels
        /**
         * args = {propertyModelID, BuildingModel}
         */
        ipcMain.on("set_building_fb", (event, args)=>{
            const user = networkManager.getCurrentUser();
            let property = ModelManager.getModels()[args.id];
            if(property.type !== "CityModel"){
                mainWindow.send("show_notification", {message: "You cannot set a building to a non-city property.", intent: "danger"});
                return;
            }
            let type = args.type;
            console.log("SET BUILD ARG");
            console.log(args);
            if(type === 'hotel' && Globals.hotelCount === 0)
                mainWindow.send("show_notification", {message: "There is no hotel left in game.", intent: "danger"});
            else if(type === 'house' && Globals.houseCount === 0)
                mainWindow.send("show_notification", {message: "There is no house left in game.", intent: "danger"});
            else{
                if(type==="house"){
                    if(property.buildings.hotel === 1){
                        mainWindow.send("show_notification", {message: "You cannot build house after a hotel.", intent: "danger"});
                        return;
                    }
                    if(property.buildings.house === 4){
                        mainWindow.send("show_notification", {message: "You cannot build more than 4 house.", intent: "danger"});
                        return;
                    }
                    let canBuild = true;
                    let allModels = ModelManager.getModels();
                    for(let index in allModels){
                        let currentModel = allModels[index];
                        if(currentModel.type === "CityModel" && currentModel.color === property.color){
                            if(currentModel.ownerId !== user.id){
                                mainWindow.send("show_notification", {message: "You cannot build before collect all the cities in a color.", intent: "danger"});
                                return;
                            }
                            if(currentModel.buildings.house < property.buildings.house){
                                canBuild = false;
                            }
                        }
                    }
                    if(canBuild){
                        if(playerManager.setMoney(networkManager.getCurrentUser().id, -property.houseCost)){
                            property.buildings.house = property.buildings.house + 1;
                            Globals.houseCount = Globals.houseCount - 1;
                            mainWindow.send("show_notification", {message: "The new house built.", intent: "success"});
                            ModelManager.getModels()[args.id].buildings = property.buildings;
                            mainWindow.send("bm_updateCity", {id: args.id, house: property.buildings.house, hotel: property.buildings.hotel});
                            networkManager.updateProperties([property]);
                        }else{
                            mainWindow.send("show_notification", {message: "There is not enough money for building.", intent: "danger"});
                        }
                    }else{
                        mainWindow.send("show_notification", {message: "You cannot build more house here.", intent: "danger"});
                    }
                }else{
                    let canBuild = true;
                    let allModels = ModelManager.getModels();
                    for(let index in allModels){
                        let currentModel = allModels[index];
                        if(currentModel.type === "CityModel" && currentModel.color === property.color){
                            if(currentModel.ownerId !== user.id){
                                mainWindow.send("show_notification", {message: "You cannot build before collect all the cities in a color.", intent: "danger"});
                                return;
                            }
                            if(currentModel.buildings.house < property.buildings.house){
                                canBuild = false;
                            }
                        }
                    }
                    if(canBuild){
                        if(property.buildings.house !== 4){
                            mainWindow.send("show_notification", {message: "You cannot build a hotel before got 4 houses.", intent: "danger"});
                            return;
                        }
                        if(property.buildings.hotel === 1){
                            mainWindow.send("show_notification", {message: "You cannot build more than one hotel.", intent: "danger"});
                            return;
                        }
                        if(playerManager.setMoney(networkManager.getCurrentUser().id, -property.hotelCost)){
                            property.buildings.hotel = property.buildings.hotel + 1;
                            Globals.hotelCount = Globals.hotelCount - 1;
                            Globals.houseCount = Globals.houseCount + 4;
                            mainWindow.send("show_notification", {message: "The new hotel built.", intent: "success"});
                            ModelManager.getModels()[args.id].buildings = property.buildings;
                            mainWindow.send("bm_updateCity", {id: args.id, house: property.buildings.house, hotel: property.buildings.hotel});
                            networkManager.updateProperties([property]);
                        }else{
                            mainWindow.send("show_notification", {message: "There is not enough money for building.", intent: "danger"});
                        }
                    }else{
                        mainWindow.send("show_notification", {message: "You cannot build a hotel before got 4 houses in each city.", intent: "danger"});
                    }
                }
            }
        });
        /**
         * args = {PropertyModelId, BuildingModel}
         */
        ipcMain.on("sell_building_house_fb", (event, args)=>{
            const user = networkManager.getCurrentUser();
            let property = cardManager.getCardById(args[0]);

            let type = args[1].type;

            if(house_Count === 32)
                console.log("All houses are in the bank, there cannot be a house on the board.");

            else {
                let cond = playerManager.sellBuilding(user.id, args, "house");

                if (cond) {
                    console.log("Building is removed successfully!");

                    house_Count += 1;
                } else {
                    console.log('Failed to remove building due to an error.')
                }
            }
        });

        ipcMain.on("sell_building_hotel_fb", (event, args)=>{
            const user = networkManager.getCurrentUser();
            console.log("Property ID " + args);

            if(hotel_Count === 32)
                console.log("All hotels are in the bank, there cannot be a house on the board.");

            else {
                let cond = playerManager.sellBuilding(user.id, args, "hotel");

                if (cond) {
                    console.log("Building is removed successfully!");

                    hotel_Count += 1;
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
            networkManager.setAuction(args.propertyModel, args.bidAmount);
        });

        ipcMain.on("sell_property_fb", (event, args)=>{//property ID
            if(args === -1){
                let properties = playerManager.getPlayers()[networkManager.getCurrentUser().id].properties;
                if(Object.keys(properties).length === 0){
                    console.log("BANKRUPCY");
                    mainWindow.send("show_notification", {message: "Game over", intent: "danger"});
                    mainWindow.send("change_page_bf", {done: true});
                }else{
                    for(let i in properties){
                        let property = properties[i];
                        networkManager.setAuction(property, 0);
                        networkManager.updateProperties([property]);
                        networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
                        return;
                    }
                }
            }else{
                let property = ModelManager.getModels()[args];
                networkManager.setAuction(property, 0);

                networkManager.updateProperties([property]);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
            }
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
                mainWindow.send("update_money_indicator", playerId.money);
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

        ipcMain.on("use_skill_fb", args =>{
            let character = playerManager.getPlayers()[networkManager.getCurrentUser().id].character;
            let tile = playerManager.getPlayers()[networkManager.getCurrentUser().id].currentTile;

            if(character === 1){
                //Driver
                let x;
                do {
                    x = this.getRandomInt(4,24);

                }while(x % 2 !== 0);
                mainWindow.send("show_notification", {message: "You used character skill! Moving " + x, intent: "success"});

                this.moveAction((tile + x) % ((Globals.tileNumber-1) * 4));
            }
            else if(character === 2){
                //child
                let x = this.getRandomInt(1,6);

                mainWindow.send("show_notification", {message: "You used character skill! Moving " + x, intent: "success"});

                this.moveAction((tile + x) % ((Globals.tileNumber-1) * 4));
            }
            else if(character === 3){
                //traveler
                if(tile !== 5 && tile !== 15 && tile !== 25 && tile !== 35){
                    mainWindow.send("show_notification", {message: "You are not in the Station", intent: "danger"});
                    Globals.isDouble = true;
                    mainWindow.send("next_state_bf", {stateName:"playNormalTurn", payload: {}});
                }
                else{
                    mainWindow.send("show_notification", {message: "You are going to the selected tile", intent: "success"});
                    this.moveAction(args);
                }
            }
        });

        ipcMain.on("exit_from_jail", (event, arg) =>{
            if(arg.type === 0){
                //next turn
                networkManager.nextState();
            }else if(arg.type === 1){
                if(playerManager.getJailLeft(networkManager.getCurrentUser().id) === 0){
                    playerManager.setMoney(networkManager.getCurrentUser().id, -50);
                    mainWindow.send("update_money_indicator", playerManager.getMoney(networkManager.getCurrentUser().id));
                    mainWindow.send("show_notification", {message: "You paid 50$ to exit from jail.", intent: "warning"});
                    networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
                }
                // exit with rolling dice
                setTimeout(()=>{
                    let currentTile = playerManager.getPlayers()[networkManager.getCurrentUser().id].currentTile;
                    let destinationTileId = (currentTile + arg.rolledDice[0] + arg.rolledDice[1]) % ((Globals.tileNumber-1) * 4);
                    playerManager.resetDoubleCount(networkManager.getCurrentUser().id);
                    Globals.isDouble = false;

                    if(questComb.forEach(quest => {if(quest.id === destinationTileId) return true;}))
                        if(diceComb.forEach(dice => {
                            if(dice.x === arg.rolledDice[0] && dice.y === arg.rolledDice[1] ||
                                dice.y === arg.rolledDice[0] && dice.x === arg.rolledDice[1])
                                return true;}))
                            playerManager.setMoney(networkManager.getCurrentUser().id, 400);

                    playerManager.exitJail(networkManager.getCurrentUser().id);
                    this.moveAction(destinationTileId);
                },1000);
            }else if(arg.type === 2){
                // exit with pay
                if(playerManager.setMoney(networkManager.getCurrentUser().id, -50)){
                    mainWindow.send("show_notification", {message: "You paid 50$ to exit from jail.", intent: "warning"});
                    playerManager.exitJail(networkManager.getCurrentUser().id);
                    mainWindow.send("bm_updateCard", playerManager.getPlayers()[networkManager.getCurrentUser().id]);
                    networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
                    mainWindow.send("next_state_bf", {stateName:"playNormalTurn", payload: {}});
                }else{
                    mainWindow.send("show_notification", {message: "You dont have enough money to exit from jail.", intent: "danger"});
                    //TODO
                }
            }else if(arg.type === 3){
                // exit with card
                mainWindow.send("show_notification", {message: "You used your card to exit from jail.", intent: "warning"});
                if(!playerManager.useCard(networkManager.getCurrentUser().id, 4)){
                    playerManager.useCard(networkManager.getCurrentUser().id, 6);
                }
                playerManager.exitJail(networkManager.getCurrentUser().id);
                mainWindow.send("bm_updateCard", playerManager.getPlayers()[networkManager.getCurrentUser().id]);
                mainWindow.send("addJailCard", true);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
                networkManager.nextState();
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

        ipcMain.on('get_messages_fb', (event, args) => {
           networkManager.getMessages();
        });

        ipcMain.on('send_message_fb', (event, messageObj) => {
            networkManager.sendMessage(messageObj);
        });

        ipcMain.on('send_message_widget_fb', (event, messageObj) => {
            networkManager.sendWidgetMessage(messageObj);
        });
    }

    stateTurn(stateObject){
        let stateName = stateObject.stateName;
        let payload = stateObject.payload;
        //console.log("NEXT STATE: " + stateName + " PAYLOAD: " + JSON.stringify(payload));
        switch (stateName) {
            case "playNormalTurn":
                if(playerManager.isInJail(networkManager.getCurrentUser().id)){
                    let turnsLeft = playerManager.getJailLeft(networkManager.getCurrentUser().id);
                    if(turnsLeft === 0){
                        playerManager.exitJail(networkManager.getCurrentUser().id);
                        mainWindow.send("next_state_bf", {stateName:"playNormalTurn", payload: payload});
                    }else{
                        playerManager.reduceJailLeft(networkManager.getCurrentUser().id);
                        let jailCard = playerManager.searchCard(networkManager.getCurrentUser().id, 6);
                        if(!jailCard)
                            jailCard = playerManager.searchCard(networkManager.getCurrentUser().id, 4);
                        if(jailCard)
                            mainWindow.send("next_state_bf", {stateName:"waitInJail", payload:{turnsLeft: turnsLeft,haveCard: true}});
                        else
                            mainWindow.send("next_state_bf", {stateName:"waitInJail", payload:{turnsLeft: turnsLeft,haveCard: false}});
                    }
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
            case "BidYourTurn":
                for( let id in stateObject.payload.auction){
                    stateObject.payload.auction[id] = {name: playerManager.getPlayers()[id], bid: stateObject.payload.auction[id]};
                }
                mainWindow.send("next_state_bf", stateObject);
                break;
            case "BidOtherPlayerTurn":
                for( let id in stateObject.payload.auction){
                    stateObject.payload.auction[id] = {name: playerManager.getPlayers()[id], bid: stateObject.payload.auction[id]};
                }
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

            if(card.id === 0){
                mainWindow.send("show_notification", {message: "Advance to GO", intent: "success"});

                setTimeout(()=>{
                    playerManager.setMoney(networkManager.getCurrentUser().id, 200);
                    mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                    networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
                    this.moveAction(0);
                }, 2000);
            }
            else if(card.id === 1){
                mainWindow.send("show_notification", {message: "Bank error in your favor—Collect $200", intent: "success"});
                playerManager.setMoney(playerID, 200);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

            }
            else if(card.id === 2){
                mainWindow.send("show_notification", {message: "Doctor's fee—Pay $50", intent: "danger"});
                playerManager.setMoney(playerID, -50);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

            }
            else if(card.id === 3){
                mainWindow.send("show_notification", {message: "From sale of stock you get $50", intent: "success"});
                playerManager.setMoney(playerID, 50);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);


            }

            else if(card.id === 5){
                mainWindow.send("show_notification", {message: "Go to Jail–Go directly to jail–Do not pass Go–Do not collect $200!", intent: "danger"});
                playerManager.sendJail(playerID);
                setTimeout(()=>{
                    this.moveAction(10);
                }, 2000);
            }

            else if(card.id === 6){
                mainWindow.send("show_notification", {message: "Grand Opera Night—Collect $50 from every player for opening night seats", intent: "primary"});
                let players = playerManager.getPlayers();
                for(let i in players){
                    let player = players[i];
                    if(playerID === player.id) {
                        playerManager.setMoney(playerID, (50 * (Object.keys(players).length - 1)));
                    }else {
                        playerManager.setMoney(player.id, -50);
                    }
                    mainWindow.send("update_money_indicator", playerManager.getPlayers()[playerID].money);
                    networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
                }
            }
            else if(card.id === 7){
                mainWindow.send("show_notification", {message: "Holiday Fund matures—Receive $100", intent: "success"});
                playerManager.setMoney(playerID, 100);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

            }
            else if(card.id === 8){
                mainWindow.send("show_notification", {message: "Income tax refund–Collect $20", intent: "success"});
                playerManager.setMoney(playerID, 20);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);


            }
            else if(card.id === 9){
                playerManager.setMoney(playerID, 10);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

                mainWindow.send("show_notification", {message: "It is your birthday—Collect $10!", intent: "success"});

            }
            else if(card.id === 10){
                playerManager.setMoney(playerID, 100);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

                mainWindow.send("show_notification", {message: "Life insurance matures–Collect $100", intent: "success"});
            }
            else if(card.id === 11){
                mainWindow.send("show_notification", {message: "Pay hospital fees of $100", intent: "danger"});
                playerManager.setMoney(playerID, -100);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

            }
            else if(card.id === 12){
                mainWindow.send("show_notification", {message: "Pay school fees of $150", intent: "danger"});
                playerManager.setMoney(playerID, -150);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

            }
            else if(card.id === 13){
                playerManager.setMoney(playerID, 25);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

                mainWindow.send("show_notification", {message: "Receive $25 consultancy fee!", intent: "success"});

            }
            else if(card.id === 14){
                mainWindow.send("show_notification", {message: "You are assessed for street repairs–$40 per house–$115 per hotel!", intent: "primary"});
                playerManager.payRepair(playerID, 40, 115);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

            }
            else if(card.id === 15){
                mainWindow.send("show_notification", {message: "You have won second prize in a beauty contest–Collect $10!", intent: "success"});
                playerManager.setMoney(playerID, 10);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

            }
            else if(card.id === 16){
                mainWindow.send("show_notification", {message: "You inherit $100!", intent: "success"});
                playerManager.setMoney(playerID, 100);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);
                networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);

            }
        }
        else {
            playerManager.addCard(playerID, card);
            mainWindow.send("addJailCard", true);
            mainWindow.send("show_notification", {message: "You get a Jail Free Card!", intent: "success"});
        }
    }

    drawChanceCard(playerID, locationID){
        let card = cardManager.drawChanceCard();

        if(!chanceUsableCards.includes(card.id)){
            cardManager.addChanceCard(card.id, card.description);

            if(card.id === 0){
                mainWindow.send("show_notification", {message: "Advance to GO", intent: "success"});

                playerManager.setMoney(networkManager.getCurrentUser().id, 200);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);

                setTimeout(()=>{
                    this.moveAction(0);

                }, 2000);
            }
            else if(card.id === 1){
                //move illinois
                mainWindow.send("show_notification", {message: "Advance to Illinois Ave – If you pass Go, collect $200", intent: "success"});

                if(locationID > 24){
                    playerManager.setMoney(networkManager.getCurrentUser().id, 200);
                    mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);

                    mainWindow.send("show_notification", {message: "You passed Start. Earned a start bonus!", intent: "success"});

                }

                setTimeout(()=>{
                    this.moveAction(24);
                }, 2000);
            }
            else if(card.id === 2){
                mainWindow.send("show_notification", {message: "Advance to St. Charles Place – If you pass Go, collect $200", intent: "success"});

                if(locationID > 11){
                    playerManager.setMoney(networkManager.getCurrentUser().id, 200);
                    mainWindow.send("update_money_indicator", playerManager.getPlayers()[networkManager.getCurrentUser().id].money);

                    mainWindow.send("show_notification", {message: "You passed Start. Earned a start bonus!", intent: "success"});

                }
                setTimeout(()=>{
                    this.moveAction(11);
                }, 2000);
            }
            else if(card.id === 3){
                //,"Advance token to nearest Utility. If unowned, you may buy it from the Bank.
                // If owned, throw dice and pay owner a total ten times the amount thrown."
                mainWindow.send("show_notification", {message: "Advance token to nearest Utility. If unowned, you may buy it from the Bank. " +
                        "If owned, throw dice and pay owner a total ten times the amount thrown.", intent: "primary"});


                if(locationID === 36){
                    let currentTile = Globals.selectedTileId === 1 ? Globals.tiles[28] : Globals.tiles2[28];
                    let cityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfCityId = cityModel.getOwner();

                    // if(ownerOfCityId && ownerOfCityId !== playerID){
                    //     playerManager.setMoney(ownerOfCityId, cityModel.getRentPrice());
                    //     playerManager.setMoney(playerID, -cityModel.getRentPrice());
                    // }

                    setTimeout(()=>{
                        this.moveAction(28);
                    }, 2000);
                }

                if(locationID === 22){
                    let currentTile = Globals.selectedTileId === 1 ? Globals.tiles[28] : Globals.tiles2[28];
                    let cityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfCityId = cityModel.getOwner();

                    // if(ownerOfCityId && ownerOfCityId !== playerID){
                    //     playerManager.setMoney(ownerOfCityId, cityModel.getRentPrice());
                    //     playerManager.setMoney(playerID, -cityModel.getRentPrice());
                    // }

                    setTimeout(()=>{
                        this.moveAction(28);
                    }, 2000);
                }

                if(locationID === 7){
                    let currentTile = Globals.selectedTileId === 1 ? Globals.tiles[12] : Globals.tiles2[12];
                    let cityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfCityId = cityModel.getOwner();

                    // if(ownerOfCityId && ownerOfCityId !== playerID){
                    //     playerManager.setMoney(ownerOfCityId, cityModel.getRentPrice());
                    //     playerManager.setMoney(playerID, -cityModel.getRentPrice());
                    // }

                    setTimeout(()=>{
                        this.moveAction(5);
                    }, 2000);
                }
            }
            else if(card.id === 4){
                //,"Advance token to the nearest Railroad and pay owner twice the rental to which
                // he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank."
                mainWindow.send("show_notification", {message: "Advance token to the nearest Railroad and pay owner twice the rental to which " +
                        "he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank", intent: "primary"});


                if(locationID === 36){
                    let currentTile = Globals.selectedTileId === 1 ? Globals.tiles[35] : Globals.tiles2[35];
                    let cityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfCityId = cityModel.getOwner();

                    if(ownerOfCityId && ownerOfCityId !== playerID){
                        playerManager.setMoney(ownerOfCityId, cityModel.getRentPrice());
                        playerManager.setMoney(playerID, -cityModel.getRentPrice());
                    }

                    mainWindow.send("update_money_indicator", playerManager.getPlayers()[playerID].money);
                    setTimeout(()=>{
                        this.moveAction(35);
                    }, 2000);
                }

                if(locationID === 22){
                    let currentTile = Globals.selectedTileId === 1 ? Globals.tiles[25] : Globals.tiles2[25];
                    let cityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfCityId = cityModel.getOwner();

                    if(ownerOfCityId && ownerOfCityId !== playerID){
                        playerManager.setMoney(ownerOfCityId, cityModel.getRentPrice());
                        playerManager.setMoney(playerID, -cityModel.getRentPrice());
                    }
                    mainWindow.send("update_money_indicator", playerManager.getPlayers()[playerID].money);

                    setTimeout(()=>{
                        this.moveAction(25);
                    }, 2000);
                }

                if(locationID === 7){
                    let currentTile = Globals.selectedTileId === 1 ? Globals.tiles[5] : Globals.tiles2[5];
                    let cityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfCityId = cityModel.getOwner();

                    if(ownerOfCityId && ownerOfCityId !== playerID){
                        playerManager.setMoney(ownerOfCityId, cityModel.getRentPrice());
                        playerManager.setMoney(playerID, -cityModel.getRentPrice());
                    }
                    mainWindow.send("update_money_indicator", playerManager.getPlayers()[playerID].money);

                    setTimeout(()=>{
                        this.moveAction(5);
                    }, 2000);
                }

            }
            else if(card.id === 5){
                //,"Bank pays you dividend of $50"
                playerManager.setMoney(playerID, 50);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[playerID].money);
                mainWindow.send("show_notification", {message: "You earned 50$ from bank!", intent: "success"});
            }

            else if(card.id === 7){
                //,"Go Back 3 Spaces"
                mainWindow.send("show_notification", {message: "Go Back 3 Spaces", intent: "primary"});

                setTimeout(()=>{
                    this.moveAction(locationID - 3);
                }, 2000);
            }
            else if(card.id === 8){
                //,"Go to Jail–Go directly to Jail–Do not pass Go, do not collect $200"
                mainWindow.send("show_notification", {message: "Go to Jail–Go directly to Jail–Do not pass Go, do not collect $200", intent: "danger"});

                playerManager.sendJail(playerID);
                setTimeout(()=>{
                    this.moveAction(10);
                }, 2000);
            }
            else if(card.id === 9){
                //,"Make general repairs on all your property–For each house pay $25–For each hotel $100"
                mainWindow.send("show_notification", {message: "Make general repairs on all your property–For each house pay $25–For each hotel $100", intent: "primary"});

                playerManager.payRepair(playerID, 25, 100);
            }
            else if(card.id === 10){
                //,"Pay poor tax of $15"
                playerManager.setMoney(playerID, -15);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[playerID].money);
                mainWindow.send("show_notification", {message: "You lost 15$ for paying tax!", intent: "danger"});

            }
            else if(card.id === 11){
                // ,"Take a trip to Reading Railroad–If you pass Go, collect $200"
                mainWindow.send("show_notification", {message: "Take a trip to Reading Railroad–If you pass Go, collect $200", intent: "primary"});

                if(locationID > 5){
                    playerManager.setMoney(playerID, 200);
                    mainWindow.send("update_money_indicator", playerManager.getPlayers()[playerID].money);
                    mainWindow.send("show_notification", {message: "You passed Start. Earned a start bonus!", intent: "success"});

                }

                setTimeout(()=>{
                    this.moveAction(5);
                }, 2000);
            }
            else if(card.id === 12){
                //,"Take a walk on the Boardwalk–Advance token to Boardwalk"
                mainWindow.send("show_notification", {message: "Take a walk on the Boardwalk–Advance token to Boardwalk", intent: "primary"});

                setTimeout(()=>{
                    this.moveAction(39);
                }, 2000);
            }
            else if(card.id === 13){
                //,"You have been elected Chairman of the Board–Pay each player $50"
                mainWindow.send("show_notification", {message: "You have been elected Chairman of the Board–Pay each player $50", intent: "primary"});

                let players = playerManager.getPlayers();
                for(let i in players){
                    let player = players[i];
                    if(playerID === player.id)
                        playerManager.setMoney(playerID, -(50 * (Object.keys(players).length - 1)));
                    else
                        playerManager.setMoney(player.id, 50);
                    mainWindow.send("update_money_indicator", playerManager.getPlayers()[playerID].money);
                }
            }
            else if(card.id === 14){
                //,"Your building and loan matures—Collect $150"
                playerManager.setMoney(playerID, 150);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[playerID].money);
                mainWindow.send("show_notification", {message: "Your building and loan matures—Collect $150!", intent: "primary"});
            }
            else if(card.id === 15) {
                //,"You have won a crossword competition—Collect $100"
                playerManager.setMoney(playerID, 100);
                mainWindow.send("update_money_indicator", playerManager.getPlayers()[playerID].money);
                mainWindow.send("show_notification", {
                    message: "You have won a crossword competition—Collect $100!",
                    intent: "primary"
                });

            }else if(card.id === 16)
                    mainWindow.send("show_notification", {message: "You get a Natural Disaster Card!", intent: "success"});
            else if(card.id === 17)
                mainWindow.send("show_notification", {message: "You get a Profit Card!", intent: "success"});
        }
        else { //6-16-17
            playerManager.addCard(playerID, card);
            if(card.id === 6) {
                mainWindow.send("show_notification", {message: "You get a Jail Free Card!", intent: "success"});
                mainWindow.send("addJailCard", true);
            }
        }
        networkManager.updatePlayers([playerManager.getPlayers()[networkManager.getCurrentUser().id]]);
    }


    mortgage(playerID, property){
        playerManager.mortgage(playerID, property);
    }

    liftMortgage(playerID, property){
        playerManager.liftMortgage(playerID,property);
    }
}

module.exports = new GameManager();

