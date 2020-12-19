import CityCardView from "../views/cardView/cityCardView";
import StationCardView from "../views/cardView/stationCardView";
import SpecialCardView from "../views/cardView/specialCardView";
import UtilityCardView from "../views/cardView/utilityCardView";
import CityGroupModel from "../models/cityGroupModel";
import Globals from "../globals";
import PIXI from "pixi.js";
import CornerTileView from "../views/tileView/cornerTileView";
import StationModel from "../models/stationModel";
import OtherPropertyTileView from "../views/tileView/otherPropertyTileView";
import CityModel from "../models/cityModel";
import CityTileView from "../views/tileView/cityTileView";
import SpecialTileView from "../views/tileView/specialTileView";
import UtilityModel from "../models/utilityModel";

const Character = require("../views/tileView/Character");
class BoardManager{
    constructor() {
        this.views = [{player :null, cards: [], character:null },{player :null, cards: [], character:null },{player :null, cards: [], character:null },{player :null, cards: [], character:null }];

    }
    initialGame(players){
        for (let i = 0; i < 4; i++){
            this.views[i].player = players[i]; //Player
            //cards için for atılacak
            let type = players[i].cards[i]["type"]; //Cards
            let value = players[i].cards[i]["value"];
            if (type === "city"){
                this.view[i].cards.push(new CityCardView(value));
            }else if(type === "station"){
                this.view[i].cards.push(new StationCardView(value));
            }
            else if(type === "special"){
                this.view[i].cards.push(new SpecialCardView(value));
            }
            else if(type === "utility"){
                this.view[i].cards.push(new UtilityCardView(value));
            }

            this.view[i].character = new Character(players[i].image, 0, players[i].id) //Character (Icon of the character?)
        }

        let browns = new CityGroupModel([], "0x382B1C");
        let lightBlues = new CityGroupModel([], "0x3CB8DE");
        let pinks = new CityGroupModel([], "0xDE3CD3");
        let oranges = new CityGroupModel([], "0xDE883C");
        let reds = new CityGroupModel([], "0xD40B0A");
        let yellows = new CityGroupModel([], "0xFFC90F");
        let greens = new CityGroupModel([], "0x24733B");
        let blues = new CityGroupModel([], "0x0541CA");

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
                let cornerTile = new CornerTileView(image, tile);
            }
            else if (type === "StationTile") {
                let rentPrice = tiles[i]["rentPrice"];
                let id = tiles[i]["id"];
                let mortgagePrice = tiles[i]["mortgagePrice"];
                let price = tiles[i]["price"];
                let imageType = tiles[i]["image"];
                image = Globals.resources[imageType].texture;
                let station = new StationModel(id, name,  rentPrice, mortgagePrice, price, tile, null, false, image);
                let stationTile = new OtherPropertyTileView(station);
            }
            else if (type === "CityTile") {
                // console.log("City tile: " + tiles[i]["tile"] );
                let id = tiles[i]["id"]
                // let name = tiles[i]["name"];
                let rentPrice = tiles[i]["rentPrice"];
                let mortgagePrice = tiles[i]["mortgagePrice"];
                let price = tiles[i]["price"];
                // let tile = tiles[i]["tile"];
                let houseCost = tiles[i]["houseCost"];
                let hotelCost = tiles[i]["hotelCost"];
                let color = tiles[i]["cityColor"];
                let cityGroup = new CityGroupModel([], 0xFFFFFF);
                if (color === browns.color) {
                    cityGroup = browns;
                }
                if (color === lightBlues.color) {
                    cityGroup = lightBlues;
                }
                if (color === pinks.color) {
                    cityGroup = pinks;
                }
                if (color === oranges.color) {
                    cityGroup = oranges;
                }
                if (color === reds.color) {
                    cityGroup = reds;
                }
                if (color === yellows.color) {
                    cityGroup = yellows;
                }
                if (color === greens.color) {
                    cityGroup = greens;
                }
                if (color === blues.color) {
                    cityGroup = blues;
                }
                let city = new CityModel(id, name,  rentPrice, mortgagePrice, price, tile, null, houseCost, hotelCost, null, cityGroup);
                cityGroup.cities.push(city);
                let cityTile = new CityTileView(city);
            }
            else if (type === "SpecialTile") {
                let imageType = tiles[i]["image"];
                image = Globals.resources[imageType].texture;
                let specialTile = new SpecialTileView(name ,image, tile);
            }
            else if (type === "UtilityTile") {
                let rentPrice = tiles[i]["rentPrice"];
                let mortgagePrice = tiles[i]["mortgagePrice"];
                let price = tiles[i]["price"];
                let imageType = tiles[i]["image"];
                image = Globals.resources[imageType].texture;
                let utility = new UtilityModel(tile, name,  rentPrice, mortgagePrice, price, tile, null, false, image);
                let utilityTile = new OtherPropertyTileView(utility);
            }
        }


    }

    move(playerId, destination){

        this.views.find(players=>players.player.id === playerId).character.move(destination);
    }

    updateCards(player){
        //destroy all cards
        let cards =  this.views.find(obj=>obj.player.id === playerId).cards;

    }

    setBuilding(tileId, buildingTypesAndNumbers){

    }
}