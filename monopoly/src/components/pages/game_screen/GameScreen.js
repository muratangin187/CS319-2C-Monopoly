import React, {useEffect} from "react";

import * as PIXI from "pixi.js";
import Globals from "../../../globals";
import board_center from "../../../views/assets/board_center.png";
import income_tax from "../../../views/assets/income_tax.png";
import community from "../../../views/assets/community.png";
import chance from "../../../views/assets/chance.png";
import luxury from "../../../views/assets/luxury.png";
import free_parking from "../../../views/assets/free_parking.png";
import visit_jail from "../../../views/assets/visit_jail.png";
import goto_jail from "../../../views/assets/goto_jail.png";
import start_tile from "../../../views/assets/start_tile.png";
import electric from "../../../views/assets/electric.png";
import water from "../../../views/assets/water.png";
import railroad from "../../../views/assets/railroad.png";
import CityGroupModel from "../../../models/cityGroupModel";
import CornerTileView from "../../../views/tileView/cornerTileView";
import StationModel from "../../../models/stationModel";
import otherPropertyTileView from "../../../views/tileView/otherPropertyTileView";
import CityModel from "../../../models/cityModel";
import cityTileView from "../../../views/tileView/cityTileView";
import cityCardView from "../../../views/cardView/cityCardView"; //card for test
import SpecialTileView from "../../../views/tileView/specialTileView";
import UtilityModel from "../../../models/utilityModel";
import Character from "../../../views/tileView/Character";
import stationCardView from "../../../views/cardView/stationCardView";
import utilityCardView from "../../../views/cardView/utilityCardView";

function initPixi(){
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
    Globals.app = new PIXI.Application({resolution: 1});
    Globals.app.renderer.roundPixels = true;
    Globals.app.renderer.resize(770, 900);
    document.getElementById("canvas").appendChild(Globals.app.view);
    const loader = Globals.app.loader.add("board_center", board_center).add("income_tax", income_tax).add("community", community).add("chance", chance).add("luxury", luxury).add("free_parking", free_parking).add("visit_jail", visit_jail).add("goto_jail", goto_jail).add("start_tile", start_tile).add("electric", electric).add("water", water).add("railroad", railroad).load(async (loader, resources)=>{
        Globals.resources = resources;


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
            // console.log("Type at the beginning: " + type);
            // console.log("type" + type);
            if (type === "CornerTile") {
                let imageType = tiles[i]["image"];
                // let tile = tiles[i]["tile"];
                // if (a === "start_tile") {
                image = Globals.resources[imageType].texture;
                // else if (tile === 10) {
                //   image = Globals.resources.visit_jail.texture;
                // }
                // else if (tile === 20) {
                //   image = Globals.resources.free_parking.texture;
                // }
                // else if (tile === 30) {
                //   image = Globals.resources.goto_jail.texture;
                // }
                let cornerTile = new CornerTileView(image, tile);
            }
            else if (type === "StationTile") {
                // console.log("Station tile: " + tiles[i]["tile"] );
                // let name = tiles[i]["name"];
                let rentPrice = tiles[i]["rentPrice"];
                let id = tiles[i]["id"];
                let mortgagePrice = tiles[i]["mortgagePrice"];
                let price = tiles[i]["price"];
                // let tile = tiles[i]["tile"];
                let imageType = tiles[i]["image"];
                image = Globals.resources[imageType].texture;
                let station = new StationModel(id, name,  rentPrice, mortgagePrice, price, tile, null, false, image);
                let stationTile = new otherPropertyTileView(station);
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
                let cityTile = new cityTileView(city);
            }
            else if (type === "SpecialTile") {
                // console.log("Special tile: " + tiles[i]["tile"] );
                // let name = tiles[i]["name"];
                // if (name === "INCOME TAX") {
                //   image = Globals.resources.income_tax.texture;
                // }
                // else if (name === "CHANCE") {
                //   image = Globals.resources.chance.texture;
                // }
                // else if (name === "COMMUNITY CHEST") {
                //   image = Globals.resources.community.texture;
                // }
                // else if (name === "LUXURY TAX") {
                //   image = Globals.resources.luxury.texture;
                // }
                // let tile = tiles[i]["tile"];
                let imageType = tiles[i]["image"];
                image = Globals.resources[imageType].texture;
                let specialTile = new SpecialTileView(name ,image, tile);
            }
            else if (type === "UtilityTile") {
                // console.log("Utility tile: " + tiles[i]["tile"] );
                // let name = tiles[i]["name"];
                let rentPrice = tiles[i]["rentPrice"];
                let mortgagePrice = tiles[i]["mortgagePrice"];
                let price = tiles[i]["price"];
                // let tile = tiles[i]["tile"];
                // if (name === "WATER WORKS") {
                //   image = Globals.resources.water.texture;
                // }
                // else if (name === "ELECTRIC COMPANY") {
                //   image = Globals.resources.electric.texture;
                // }
                let imageType = tiles[i]["image"];
                image = Globals.resources[imageType].texture;
                let utility = new UtilityModel(tile, name,  rentPrice, mortgagePrice, price, tile, null, false, image);
                let utilityTile = new otherPropertyTileView(utility);
            }
        }
        let cards = [
            // {
            //     "type": "station",
            //     "value" : new StationModel(10, "ankara", [50,100,200,400,600,1000], 25, 50, 10, null, false, image)
            // },
            {
                "type" : "city",
                "value" : new CityModel(10, "Ankara",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, browns)
            },
            {
                "type" : "city",
                "value" : new CityModel(4, "IZMIR", [50,100,200,400,600,1000], 25, 50,10 , null, 200, 200, null, lightBlues)
            },
            {
                "type" : "city",
                "value" : new CityModel(8, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, pinks)
            },
            {
                "type" : "city",
                "value" : new CityModel(27, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, oranges)
            },
            {
                "type" : "city",
                "value" : new CityModel(21, "Ankara",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, reds)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50,10 , null, 200, 200, null, yellows)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, greens)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, blues)
            },
            {
                "type" : "city",
                "value" : new CityModel(23, "Ankara",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, browns)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50,10 , null, 200, 200, null, lightBlues)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, pinks)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, oranges)
            },
            {
                "type" : "city",
                "value" : new CityModel(23, "Ankara",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, reds)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50,10 , null, 200, 200, null, yellows)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, greens)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, blues)
            },
            {
                "type" : "city",
                "value" : new CityModel(23, "Ankara",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, browns)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50,10 , null, 200, 200, null, lightBlues)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, pinks)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, oranges)
            },
            {
                "type" : "city",
                "value" : new CityModel(23, "Ankara",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, reds)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50,10 , null, 200, 200, null, yellows)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, greens)
            },
            {
                "type" : "city",
                "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, blues)
            },

        ];

        //
        //let offset = [0,0,0,0,0,0,0,0]
        let cardExs = [];
        function offset(selectedId) {
            let found =false;
            for (let i = 0; i < 5; i++) {

                if (!found) {
                    cardExs[i].card.x =cardExs[i].card.oldx +  i * 30;
                }
                else {
                    cardExs[i].card.x = cardExs[i].card.oldx + i * 30 + 100;
                }
                if (cardExs[i].id === selectedId) {
                    found =true;

                }
                console.log("founded" +" cardExs[i].card.id: " + cardExs[i].id);

            }
        }

        for(let i = 0; i < 5; i++) {
            let type = cards[i]["type"];
            let value = cards[i]["value"];
            if (type === "city"){
                let cardEx = new cityCardView(value);
                cardEx.setCallBack((selectedId) =>{
                    offset(selectedId);
                    console.log("SelectedIdIn" + selectedId);
                },(selectedId)=>{
                    console.log("SelectedIdOut" + selectedId);
                });
                cardEx.card.oldx = cardEx.card.x;
                cardEx.card.x += i * 30;
                // console.log("Bunu da yap " + cardEx.id)

                cardExs.push(cardEx);
                //cardEx.
                // if (value.cityGroup === browns) {
                //     cardEx.card.x = 0;
                //     //offset[0] += 1;
                //     //cardEx.card.x += //offset[0]*20;
                //
                // }
                // if (value.cityGroup === lightBlues) {
                //     cardEx.card.x = 150;
                //     //offset[1] += 1;
                //     //cardEx.card.x += //offset[1]*20;
                // }
                // if (value.cityGroup === pinks) {
                //     cardEx.card.x = 300;
                //     //offset[2] += 1;
                //     //cardEx.card.x += //offset[2]*20;
                // }
                // if (value.cityGroup === oranges) {
                //     cardEx.card.x = 450;
                //     //offset[3] += 1;
                //     //cardEx.card.x += //offset[3]*20;
                // }
                // if (value.cityGroup === reds) {
                //     cardEx.card.x = 0;
                //     cardEx.card.y += 250;
                //     //offset[4] += 1;
                //     //cardEx.card.x += //offset[4]*20;
                // }
                // if (value.cityGroup === yellows) {
                //     cardEx.card.x = 150;
                //     cardEx.card.y += 250;
                //     //offset[5] += 1;
                //     //cardEx.card.x += //offset[5]*20;
                // }
                // if (value.cityGroup === greens) {
                //     cardEx.card.x = 300;
                //     cardEx.card.y += 250
                //     //offset[6] += 1;
                //     //cardEx.card.x += //offset[6]*20;
                // }
                // if (value.cityGroup === blues) {
                //     cardEx.card.x = 450;
                //     cardEx.card.y += 250
                //     //offset[7] += 1;
                //     //cardEx.card.x += //offset[7]*20;
                // }


            }
            // else if (type === "station"){
            //     console.log("value : " + value.name);
            //     let cardEx = new stationCardView(value);
            // }
            // else if(type === "utility"){
            //     let cardEx = new utilityCardView(value);
            // }
            else if(type === "special"){
                console.log("special card is not ready.");
            }
        }

        // let city1 =
        //let card1 = new cityCardView(new CityModel(0, "ankara", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, blues));

        let char1 = new Character(Globals.resources.electric.texture, 0, 0);
        let char2 = new Character(Globals.resources.electric.texture, 22,1) ;
        let char3 = new Character(Globals.resources.electric.texture, 13,2);
        let char4 = new Character(Globals.resources.electric.texture, 6,3);
        //char1.move(39);

        //for(let i = 0; i < 10; i++){
        //    await char1.move(Math.abs(i-39) % 40);
        //    await char2.move(Math.abs(i-39) % 40);
        //    await char3.move(Math.abs(i-39) % 40);
        //    await char4.move(Math.abs(i-39) % 40);
        //}


        //(char1.x = 50;
        console.log(char1.x) ;
    });
}

function GameScreen(props) {
    //let currentUserId = props.currentUser.id;
    //let currentUsername = props.currentUser.username;
    //let room = props.room;
    //let currentPlayerObject = props.room.users.find(user => user.id === currentUserId);

    useEffect(()=>{
        initPixi();
    }, []);

    return (
        <div className="canvasDiv">
            <div id="canvas"/>
        </div>
    );
}

export default GameScreen;