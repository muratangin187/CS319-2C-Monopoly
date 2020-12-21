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

let questComb = [];
let diceComb = [];

class GameManager{
    constructor() {
        this.createListeners();
        networkManager.setStateListener(this.stateTurn);
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
        let winnerPlayer = playerManager.getPlayers()[winnerId];
        playerManager.setMoney(winnerId, -bidAmount);
        currentProperty.setOwner(winnerId);
        winnerPlayer.properties.push(currentProperty);
        if(networkManager.getCurrentUser().id === winnerId){
            mainWindow.send("update_money_indicator", winnerPlayer.money);
            mainWindow.send("show_notification", {message: "You win auction for " + propertyModel.name + ".", intent: "success"});
            mainWindow.send("bm_updateCard", playerManager.getPlayers()[networkManager.getCurrentUser().id]);
        }
        if(networkManager.getCurrentUser().id === auctionStarter){
            networkManager.nextState();
        }
    }

    updatePlayerListener(players){
        players.forEach(newPlayerModel=>{
            let oldPlayerModel = playerManager.getPlayers()[newPlayerModel.id];
            if(newPlayerModel.money > oldPlayerModel.money){
                let diff = newPlayerModel.money - oldPlayerModel.money;
                mainWindow.send("show_notification", {message: "You earn " + diff + "$.", intent: "success"});
            }else if(newPlayerModel.money < oldPlayerModel.money){
                let diff = oldPlayerModel.money - newPlayerModel.money;
                if(newPlayerModel.id === networkManager.getCurrentUser().id) {
                    mainWindow.send("show_notification", {message: "You paid " + diff + "$.", intent: "danger"});
                }
            }
            if(newPlayerModel.id === networkManager.getCurrentUser().id){
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

    moveAction(destinationTileId){
        networkManager.movePlayer(destinationTileId);
        playerManager.getPlayers()[networkManager.getCurrentUser().id].currentTile = destinationTileId;
        if(playerManager.isInJail(networkManager.getCurrentUser().id)){
            // set state to jail screen
            Globals.isDouble = false;
            this.stateTurn({stateName: "playNormalTurn", payload:{}});
        }else{
            // set state to according to tile
            console.log("WENT TO NEW TILE: " + destinationTileId);
            // TODO call stateTurn according to new tile
            //console.log("THIS.TILES: " + JSON.stringify(Globals.tiles, null, 2));
            let currentTile = Globals.tiles.find(tile=> tile.tile === destinationTileId);
            switch(currentTile.type){
                case "CornerTile":
                    if(destinationTileId === 30){
                        playerManager.sendJail(networkManager.getCurrentUser().id);
                    }
                    networkManager.nextState();
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
                            mainWindow.send("show_notification", {message: "You paid " + rentPrice + "$.", intent: "danger"});
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

                    else if(destinationTileId === 4 || destinationTileId === 38){
                        playerManager.setMoney(networkManager.getCurrentUser().id, -200);
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
            Globals.isDouble = rolledDice[0] === rolledDice[1];


            if(questComb.forEach(quest => {if(quest.id === destinationTileId) return true;}))
                if(diceComb.forEach(dice => {
                    if(dice.x === rolledDice[0] && dice.y === rolledDice[1] ||
                        dice.y === rolledDice[0] && dice.x === rolledDice[1])
                        return true;}))
                    playerManager.setMoney(networkManager.getCurrentUser().id, 400);

            this.moveAction(destinationTileId);
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
            networkManager.setAuction(args.propertyModel, args.bidAmount);
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
                    this.moveAction(0);
                }, 2000);
            }
            else if(card.id === 1){
                mainWindow.send("show_notification", {message: "Bank error in your favor—Collect $200", intent: "success"});
                playerManager.setMoney(playerID, 200);
            }
            else if(card.id === 2){
                mainWindow.send("show_notification", {message: "Doctor's fee—Pay $50", intent: "danger"});
                playerManager.setMoney(playerID, -50);
            }
            else if(card.id === 3){
                mainWindow.send("show_notification", {message: "From sale of stock you get $50", intent: "success"});
                playerManager.setMoney(playerID, 50);

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
                players.forEach(player =>{
                    if(playerID === player.id)
                        playerManager.setMoney(playerID, (50 * (players.length - 1)));
                    else
                        playerManager.setMoney(player.id, -50);
                });
            }
            else if(card.id === 7){
                mainWindow.send("show_notification", {message: "Holiday Fund matures—Receive $100", intent: "success"});
                playerManager.setMoney(playerID, 100);
            }
            else if(card.id === 8){
                mainWindow.send("show_notification", {message: "Income tax refund–Collect $20", intent: "success"});
                playerManager.setMoney(playerID, 20);

            }
            else if(card.id === 9){
                playerManager.setMoney(playerID, 10);
                mainWindow.send("show_notification", {message: "It is your birthday—Collect $10!", intent: "success"});

            }
            else if(card.id === 10){
                playerManager.setMoney(playerID, 100);
                mainWindow.send("show_notification", {message: "Life insurance matures–Collect $100", intent: "success"});
            }
            else if(card.id === 11){
                mainWindow.send("show_notification", {message: "Pay hospital fees of $100", intent: "danger"});
                playerManager.setMoney(playerID, -100);
            }
            else if(card.id === 12){
                mainWindow.send("show_notification", {message: "Pay school fees of $150", intent: "danger"});
                playerManager.setMoney(playerID, -150);
            }
            else if(card.id === 13){
                playerManager.setMoney(playerID, 25);
                mainWindow.send("show_notification", {message: "Receive $25 consultancy fee!", intent: "success"});

            }
            else if(card.id === 14){
                mainWindow.send("show_notification", {message: "You are assessed for street repairs–$40 per house–$115 per hotel!", intent: "primary"});
                playerManager.payRepair(playerID, 40, 115);
            }
            else if(card.id === 15){
                mainWindow.send("show_notification", {message: "You have won second prize in a beauty contest–Collect $10!", intent: "success"});
                playerManager.setMoney(playerID, 10);
            }
            else if(card.id === 16){
                mainWindow.send("show_notification", {message: "You inherit $100!", intent: "success"});
                playerManager.setMoney(playerID, 100);
            }
        }
        else {
            playerManager.addCard(playerID, card);
            mainWindow.send("show_notification", {message: "You get a Jail Free Card!", intent: "success"});
        }
    }

    drawChanceCard(playerID, locationID){
        let card = cardManager.drawChanceCard();

        if(!chanceUsableCards.includes(card.id)){
            cardManager.addChanceCard(card.id, card.description);

            if(card.id === 0){
                mainWindow.send("show_notification", {message: "Advance to GO", intent: "success"});

                setTimeout(()=>{
                    this.moveAction(0);
                }, 2000);
            }
            else if(card.id === 1){
                //move illinois
                mainWindow.send("show_notification", {message: "Advance to Illinois Ave – If you pass Go, collect $200", intent: "success"});

                if(locationID > 24){
                    playerManager.setMoney(networkManager.getCurrentUser().id, 200);
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
                    let currentTile = Globals.tiles[28];
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
                    let currentTile = Globals.tiles[28];
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
                    let currentTile = Globals.tiles[12];
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
                    let currentTile = Globals.tiles[35];
                    let cityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfCityId = cityModel.getOwner();

                    if(ownerOfCityId && ownerOfCityId !== playerID){
                        playerManager.setMoney(ownerOfCityId, cityModel.getRentPrice());
                        playerManager.setMoney(playerID, -cityModel.getRentPrice());
                    }

                    setTimeout(()=>{
                        this.moveAction(35);
                    }, 2000);
                }

                if(locationID === 22){
                    let currentTile = Globals.tiles[25];
                    let cityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfCityId = cityModel.getOwner();

                    if(ownerOfCityId && ownerOfCityId !== playerID){
                        playerManager.setMoney(ownerOfCityId, cityModel.getRentPrice());
                        playerManager.setMoney(playerID, -cityModel.getRentPrice());
                    }

                    setTimeout(()=>{
                        this.moveAction(25);
                    }, 2000);
                }

                if(locationID === 7){
                    let currentTile = Globals.tiles[5];
                    let cityModel = ModelManager.getModels()[currentTile.tile];
                    let ownerOfCityId = cityModel.getOwner();

                    if(ownerOfCityId && ownerOfCityId !== playerID){
                        playerManager.setMoney(ownerOfCityId, cityModel.getRentPrice());
                        playerManager.setMoney(playerID, -cityModel.getRentPrice());
                    }

                    setTimeout(()=>{
                        this.moveAction(5);
                    }, 2000);
                }

            }
            else if(card.id === 5){
                //,"Bank pays you dividend of $50"
                playerManager.setMoney(playerID, 50);
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
                mainWindow.send("show_notification", {message: "You lost 15$ for paying tax!", intent: "danger"});

            }
            else if(card.id === 11){
                // ,"Take a trip to Reading Railroad–If you pass Go, collect $200"
                mainWindow.send("show_notification", {message: "Take a trip to Reading Railroad–If you pass Go, collect $200", intent: "primary"});

                if(locationID > 5){
                    playerManager.setMoney(playerID, 200);
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
                players.forEach(player =>{
                    if(playerID === player.id)
                        playerManager.setMoney(playerID, -(50 * (players.length - 1)));
                    else
                        playerManager.setMoney(player.id, 50);
                });
            }
            else if(card.id === 14){
                //,"Your building and loan matures—Collect $150"
                playerManager.setMoney(playerID, 150);
                mainWindow.send("show_notification", {message: "Your building and loan matures—Collect $150!", intent: "primary"});
            }
            else if(card.id === 15){
                //,"You have won a crossword competition—Collect $100"
                playerManager.setMoney(playerID, 100);
                mainWindow.send("show_notification", {message: "You have won a crossword competition—Collect $100!", intent: "primary"});

            }
        }
        else { //6-16-17
            playerManager.addCard(playerID, card);
            if(card.id === 6)
                mainWindow.send("show_notification", {message: "You get a Jail Free Card!", intent: "success"});
            else if(card.id === 16)
                mainWindow.send("show_notification", {message: "You get a Natural Disaster Card!", intent: "success"});

            else if(card.id === 17)
                mainWindow.send("show_notification", {message: "You get a Profit Card!", intent: "success"});

        }
    }


    mortgage(playerID, property){
        playerManager.mortgage(playerID, property);
    }

    liftMortgage(playerID, property){
        playerManager.liftMortgage(playerID,property);
    }
}

module.exports = new GameManager();

