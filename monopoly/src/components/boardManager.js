import CityCardView from "../views/cardView/cityCardView";
import StationCardView from "../views/cardView/stationCardView";
import SpecialCardView from "../views/cardView/specialCardView";
import UtilityCardView from "../views/cardView/utilityCardView";
import CityGroupModel from "../models/cityGroupModel";
import Globals from "../globals";
import ModelManager from "../managers/modelManager";
import * as PIXI from "pixi.js";
import CornerTileView from "../views/tileView/cornerTileView";
import StationModel from "../models/stationModel";
import OtherPropertyTileView from "../views/tileView/otherPropertyTileView";
import CityModel from "../models/cityModel";
import CityTileView from "../views/tileView/cityTileView";
import SpecialTileView from "../views/tileView/specialTileView";
import UtilityModel from "../models/utilityModel";
import board_center from "../views/assets/board_center.png";
import income_tax from "../views/assets/income_tax.png";
import community from "../views/assets/community.png";
import chance from "../views/assets/chance.png";
import luxury from "../views/assets/luxury.png";
import free_parking from "../views/assets/free_parking.png";
import visit_jail from "../views/assets/visit_jail.png";
import goto_jail from "../views/assets/goto_jail.png";
import start_tile from "../views/assets/start_tile.png";
import electric from "../views/assets/electric.png";
import water from "../views/assets/water.png";
import railroad from "../views/assets/railroad.png";
import pion1 from "../views/assets/pion1.png";
import pion2 from "../views/assets/pion2.png";
import pion3 from "../views/assets/pion3.png";
import pion4 from "../views/assets/pion4.png";
const {ipcRenderer} = require('electron');
import Character from "../views/tileView/Character";
class BoardManager{
    constructor() {
        this.views = {};
        this.tiles = {};
        this.models = {};
        this.selectedCardId = -1;
        this.isClickedCard = false;
        ipcRenderer.on("bm_initializeGame", (event, args)=>{
            setTimeout(()=>{
                this.initializeGame(args);
            }, 1000);
        });
        ipcRenderer.on("bm_findTile", (event, args)=>{
            this.findTile(args);
        });
        ipcRenderer.on("bm_findModel", (event, args)=>{
            this.findModel(args);
        });
        ipcRenderer.on("bm_move", (event, args)=>{
            console.log("MOVE: " + args.playerId + " | " + args.destinationTileId);
            this.move(args.playerId, args.destinationTileId);
        });
        ipcRenderer.on("bm_updateCard", (event, args)=>{
            this.updateCards(args);
        });
    }

    initializeGame(players){
        //players = {"bJCKvbl28W0N3jPMAAAD":{"id":"bJCKvbl28W0N3jPMAAAD","username":"Murat","avatar":null,"state":null,"money":200,"inJail":false,"inJailLeft":0,"doubleCount":0,"cards":[],"properties":[],"currentTile":0},"nhkOKa0HiLpAp7YeAAAF":{"id":"nhkOKa0HiLpAp7YeAAAF","username":"Emre","avatar":null,"state":null,"money":200,"inJail":false,"inJailLeft":0,"doubleCount":0,"cards":[],"properties":[],"currentTile":0}};
        PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
        Globals.app = new PIXI.Application({resolution: 2});
        Globals.app.renderer.roundPixels = true;
        Globals.app.renderer.resize(880, 880);
        document.getElementById("canvas").appendChild(Globals.app.view);
        const loader = Globals.app.loader.add("board_center", board_center).add("income_tax", income_tax).add("community", community).add("chance", chance).add("luxury", luxury).add("free_parking", free_parking).add("visit_jail", visit_jail).add("goto_jail", goto_jail).add("start_tile", start_tile).add("electric", electric).add("water", water).add("pion1", pion1).add("pion2", pion2).add("pion3", pion3).add("pion4", pion4).add("railroad", railroad).load(async (loader, resources)=> {
            Globals.resources = resources;
            Globals.appHand = new PIXI.Application({resolution: 2});
            Globals.appHand.renderer.roundPixels = true;
            Globals.appHand.renderer.resize(720, 450);
            Globals.appHand.renderer.backgroundColor = 0xCEE5D1;
            document.getElementById("canvas_hand").appendChild(Globals.appHand.view);

            //let browns = new CityGroupModel([], "0x382B1C");
            //let lightBlues = new CityGroupModel([], "0x3CB8DE");
            //let pinks = new CityGroupModel([], "0xDE3CD3");
            //let oranges = new CityGroupModel([], "0xDE883C");
            //let reds = new CityGroupModel([], "0xD40B0A");
            //let yellows = new CityGroupModel([], "0xFFC90F");
            //let greens = new CityGroupModel([], "0x24733B");
            //let blues = new CityGroupModel([], "0x0541CA");

            let tiles = Globals.tiles;
            let image = Globals.resources["board_center"].texture;
            let board_center = new PIXI.Sprite(image);
            board_center.x = Globals.sizeOfBoard / Globals.tileNumber;
            board_center.y = Globals.sizeOfBoard / Globals.tileNumber;
            board_center.width = Globals.sizeOfBoard / Globals.tileNumber * (Globals.tileNumber-2);
            board_center.height = Globals.sizeOfBoard / Globals.tileNumber * (Globals.tileNumber-2);
            Globals.app.stage.addChild(board_center);
            for(let i = 0; i < 40; i++){
                let type = tiles[i]["type"];
                let name = tiles[i]["name"];
                let tile = tiles[i]["tile"];
                if (type === "CornerTile") {
                    let imageType = tiles[i]["image"];
                    image = Globals.resources[imageType].texture;
                    this.tiles[tile] = new CornerTileView(image, tile);
                }
                else if (type === "StationTile") {
                    //let rentPrice = tiles[i]["rentPrice"];
                    let id = tiles[i]["id"];
                    //let mortgagePrice = tiles[i]["mortgagePrice"];
                    //let price = tiles[i]["price"];
                    //let imageType = tiles[i]["image"];
                    //image = Globals.resources[imageType].texture;
                    //let station = new StationModel(id, name,  rentPrice, mortgagePrice, price, tile, null, false, image);
                    //this.models[id] = station;
                    this.tiles[tile] = (new OtherPropertyTileView(ModelManager.getModels()[id]));
                }
                else if (type === "CityTile") {
                    let id = tiles[i]["id"]
                    this.tiles[tile] = (new CityTileView(ModelManager.getModels()[id]));
                }
                else if (type === "SpecialTile") {
                    let imageType = tiles[i]["image"];
                    image = Globals.resources[imageType].texture;
                    this.tiles[tile] = (new SpecialTileView(name ,image, tile));
                }
                else if (type === "UtilityTile") {
                    //let rentPrice = tiles[i]["rentPrice"];
                    //let mortgagePrice = tiles[i]["mortgagePrice"];
                    //let price = tiles[i]["price"];
                    //let imageType = tiles[i]["image"];
                    //image = Globals.resources[imageType].texture;
                    //let utility = new UtilityModel(tile, name,  rentPrice, mortgagePrice, price, tile,false, Globals.resources[image].texture);
                    //this.models[tile] = utility;
                    this.tiles[tile] = (new OtherPropertyTileView(ModelManager.getModels()[tile]));
                }
            }

            console.log("PLAYERS FROM BOARDMANAGER: " + JSON.stringify(players));
            let counter = 0;
            for (let i in players) {
                console.log("I WILL DRAW CARDS IN FOR");
                this.views[i] = {player: players[i], cards: []};
                players[i].properties.forEach(card=>{
                    let type = card["type"]; //Cards
                    let value = card["value"];
                    if (type === "city"){
                        this.views[i].cards.push(new CityCardView(value));
                    }else if(type === "station"){
                        this.views[i].cards.push(new StationCardView(value));
                    }
                    else if(type === "special"){
                        this.views[i].cards.push(new SpecialCardView(value));
                    }
                    else if(type === "utility"){
                        this.views[i].cards.push(new UtilityCardView(value));
                    }
                });
                console.log("I WILL DRAW A CHARACTER");
                if(counter === 0){
                    this.views[i].character = new Character(Globals.resources.pion1.texture, 0, players[i].id) //Character (Icon of the character?)
                }else if(counter === 1){
                    this.views[i].character = new Character(Globals.resources.pion2.texture, 0, players[i].id) //Character (Icon of the character?)
                } else if(counter === 1){
                    this.views[i].character = new Character(Globals.resources.pion3.texture, 0, players[i].id) //Character (Icon of the character?)
                } else if(counter === 1){
                    this.views[i].character = new Character(Globals.resources.pion4.texture, 0, players[i].id) //Character (Icon of the character?)
                }
            counter++;
            }
            //ipcRenderer.send("updateTilesAndModels", {tiles: this.tiles, models: this.models});
        });

    }

    findTile(id){
        return this.tiles[id];
    }

    findModel(id){
        return this.models[id];
    }

    move(playerId, destination){
        this.views[playerId].character.move(destination);
    }

    updateCards(player){
        let self = this;
        function offset(playerId, selectedId) {
            if(self.selectedCardId !== -1) return;
            let foundUp =false;
            let foundDown =false;
            for (let i = 0; i < cardCount; i++) {
                if(i < 10){
                    if (!foundUp) {
                        self.views[playerId].cards[i].card.x =self.views[playerId].cards[i].card.oldx +  i * 30;
                    }
                    else {
                        self.views[playerId].cards[i].card.x = self.views[playerId].cards[i].card.oldx + i * 30 + 120;
                    }
                    if (self.views[playerId].cards[i].id === selectedId) {
                        foundUp =true;
                    }
                }else{
                    if (!foundDown) {
                        self.views[playerId].cards[i].card.x =self.views[playerId].cards[i].card.oldx +  (i-10) * 30;
                    }
                    else {
                        self.views[playerId].cards[i].card.x = self.views[playerId].cards[i].card.oldx + (i-10) * 30 + 120;
                    }
                    if (self.views[playerId].cards[i].id === selectedId) {
                        foundDown =true;
                    }
                }
            }
        }
        if(this.views[player.id].cards)
            this.views[player.id].cards.forEach(card=>card.card.destroy());
        this.views[player.id].cards = [];
        console.log("updateCard started");
        let maxWidth = 100;
        let cardCount = player.properties.length + player.cards.length;
        if(cardCount>= 2)
            maxWidth = (cardCount-2)*30 + 205;
        player.properties.forEach((property, index)=>{
            if (property.type === "CityModel"){
                this.views[player.id].cards.push(new CityCardView(property));
            }else if(property.type === "StationModel"){
                this.views[player.id].cards.push(new StationCardView(property));
            }
            else if(property.type === "SpecialModel"){
                //TODO
                //this.views[player.id].cards.push(new SpecialCardView(property));
            }
            else if(property.type === "UtilityModel"){
                this.views[player.id].cards.push(new UtilityCardView(property));
            }
            let lastCard = this.views[player.id].cards[this.views[player.id].cards.length - 1];
            if(index >= 10){
                lastCard.card.x = (720 - maxWidth) / 2;
                lastCard.card.oldx = lastCard.card.x;
                lastCard.card.x += (index-10) * 30;
                lastCard.card.y += 210;
            }else{
                lastCard.card.x = (720 - maxWidth) / 2;
                lastCard.card.oldx = lastCard.card.x;
                lastCard.card.x += index * 30;
            }

            if(this.selectedCardId === property.id){
                lastCard.selectedBorder = new PIXI.Graphics();
                lastCard.selectedBorder.name = "selectedBorder";
                lastCard.selectedBorder.lineStyle(5, 0x000);
                lastCard.selectedBorder.drawRect(0, 0, 150, 242);
                lastCard.selectedBorder.position.set(lastCard.border.x,lastCard.border.y);
                lastCard.card.addChild(lastCard.selectedBorder);
                offset(player.id, lastCard.id);
            }

            lastCard.setCallBack((selectedId) =>{
                offset(player.id, selectedId);
            },(selectedId)=>{
                if(this.selectedCardId !== -1) return;
                for (let i = 0; i < cardCount; i++) {
                    if(i < 10) {
                        this.views[player.id].cards[i].card.x = this.views[player.id].cards[i].card.oldx + i * 30;
                    }else {
                        this.views[player.id].cards[i].card.x = this.views[player.id].cards[i].card.oldx + (i - 10) * 30;
                    }
                }
            }, (card)=>{
                if(this.selectedCardId !== -1){
                    for (let i = 0; i < cardCount; i++) {
                        if(i < 10)
                            this.views[player.id].cards[i].card.x = this.views[player.id].cards[i].card.oldx + i * 30;
                        else
                            this.views[player.id].cards[i].card.x = this.views[player.id].cards[i].card.oldx + (i-10) * 30;
                        if(this.views[player.id].cards[i].id === this.selectedCardId)
                            this.views[player.id].cards[i].selectedBorder.destroy();
                        this.views[player.id].cards[i].card.removeChild(this.views[player.id].cards[i].selectedBorder);
                    }
                    this.selectedCardId = -1;
                }
                offset(player.id, card.id);
                this.selectedCardId = card.id;
                card.selectedBorder = new PIXI.Graphics();
                card.selectedBorder.name = "selectedBorder";
                card.selectedBorder.lineStyle(5, 0x000);
                card.selectedBorder.drawRect(0, 0, 150, 242);
                card.selectedBorder.position.set(card.border.x,card.border.y);
                card.card.addChild(card.selectedBorder);
                console.log("SELECTED CARD: " + this.selectedCardId);
                this.isClickedCard = true;
            });

            console.log("updateCard iteration");
        });
        player.cards.forEach(card=>{
            console.log("updateCard iteration");
        });
        console.log("updateCard finished");
    }

    setBuilding(tileId, buildingTypesAndNumbers){

    }
}

export default new BoardManager();