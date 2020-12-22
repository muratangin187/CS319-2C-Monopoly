const Globals = require("../globals");
const StationModel = require("../models/stationModel");
const CityGroupModel = require("../models/cityGroupModel");
const CityModel = require("../models/cityModel");
const UtilityModel = require("../models/utilityModel");

class ModelManager{
    constructor(){
        console.log("YARATTIM");
        let tiles = Globals.tiles;
        let browns = new CityGroupModel([], "0x382B1C");
        let lightBlues = new CityGroupModel([], "0x3CB8DE");
        let pinks = new CityGroupModel([], "0xDE3CD3");
        let oranges = new CityGroupModel([], "0xDE883C");
        let reds = new CityGroupModel([], "0xD40B0A");
        let yellows = new CityGroupModel([], "0xFFC90F");
        let greens = new CityGroupModel([], "0x24733B");
        let blues = new CityGroupModel([], "0x0541CA");
        this.models = {};
        this.cityGroupModels = {};
        this.cityGroupModels[0] = (browns);
        this.cityGroupModels[1] = (lightBlues);
        this.cityGroupModels[2] = (pinks);
        this.cityGroupModels[3] = (oranges);
        this.cityGroupModels[4] = (reds);
        this.cityGroupModels[5] = (yellows);
        this.cityGroupModels[6] = (greens);
        this.cityGroupModels[7] = (blues);
        for (let i = 0; i < 40; i++) {
            let type = tiles[i]["type"];
            let name = tiles[i]["name"];
            let tile = tiles[i]["tile"];
            if (type === "StationTile") {
                let rentPrice = tiles[i]["rentPrice"];
                let id = tiles[i]["id"];
                let mortgagePrice = tiles[i]["mortgagePrice"];
                let price = tiles[i]["price"];
                let imageType = tiles[i]["image"];
                this.models[id] = new StationModel(id, name, rentPrice, mortgagePrice, price, tile, false, imageType);
            } else if (type === "CityTile") {
                let id = tiles[i]["id"]
                let rentPrice = tiles[i]["rentPrice"];
                let mortgagePrice = tiles[i]["mortgagePrice"];
                let price = tiles[i]["price"];
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
                let city = new CityModel(id, name, rentPrice, mortgagePrice, price, tile, houseCost, hotelCost, {"house":0, "hotel":0}, color);
                cityGroup.cities.push(city);
                this.models[id] = city;
            } else if (type === "UtilityTile") {
                let rentPrice = tiles[i]["rentPrice"];
                let mortgagePrice = tiles[i]["mortgagePrice"];
                let price = tiles[i]["price"];
                let imageType = tiles[i]["image"];
                this.models[tile] = new UtilityModel(tile, name, rentPrice, mortgagePrice, price, tile, false, imageType);
            }
        }
    }

    createModels() {
    }

    getModels(){
        return this.models;
    }

    getCityGroupModels(){
        return this.cityGroupModels;
    }
}

module.exports = new ModelManager();