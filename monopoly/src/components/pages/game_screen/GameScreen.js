import React, {useEffect} from "react";
import { Widget } from 'react-chat-widget';

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
import OtherPropertyTileView from "../../../views/tileView/otherPropertyTileView";
import CityModel from "../../../models/cityModel";
import CityTileView from "../../../views/tileView/cityTileView";
import CityCardView from "../../../views/cardView/cityCardView";
import SpecialTileView from "../../../views/tileView/specialTileView";
import UtilityModel from "../../../models/utilityModel";
import Character from "../../../views/tileView/Character";
import UtilityCardView from "../../../views/cardView/utilityCardView";
import {Button, Card, Drawer, Position} from "@blueprintjs/core";
import ReactDice from 'react-dice-complete'
import YourTurnState from "./components/YourTurnState";
import OtherPlayersTurn from "./components/OtherPlayersTurn";
import StationCardView from "../../../views/cardView/stationCardView";

function initPixi(){
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
    Globals.app = new PIXI.Application({resolution: 2});
    Globals.app.renderer.roundPixels = true;
    Globals.app.renderer.resize(880, 880);
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
        initPixiForHand();
    });
}

function initPixiForHand(){
    Globals.appHand = new PIXI.Application({resolution: 2});
    Globals.appHand.renderer.roundPixels = true;
    Globals.appHand.renderer.resize(720, 450);
    Globals.appHand.renderer.backgroundColor = 0xCEE5D1;
    document.getElementById("canvas_hand").appendChild(Globals.appHand.view);
    Globals.appHand.view.addEventListener("mousedown",()=>{
        if(isClickedCard){
            isClickedCard = false;
        }else{
            for (let i = 0; i < cardCount; i++) {
                if(i < 10)
                    cardExs[i].card.x = cardExs[i].card.oldx + i * 30;
                else
                    cardExs[i].card.x = cardExs[i].card.oldx + (i-10) * 30;
                if(cardExs[i].id === selectedCardId)
                    cardExs[i].selectedBorder.destroy();
                    cardExs[i].card.removeChild(cardExs[i].selectedBorder);
            }
            selectedCardId = -1;
            console.log("SELECTED CARD: " + selectedCardId);
        }
    });

    let browns = new CityGroupModel([], "0x382B1C");
    let lightBlues = new CityGroupModel([], "0x3CB8DE");
    let pinks = new CityGroupModel([], "0xDE3CD3");
    let oranges = new CityGroupModel([], "0xDE883C");
    let reds = new CityGroupModel([], "0xD40B0A");
    let yellows = new CityGroupModel([], "0xFFC90F");
    let greens = new CityGroupModel([], "0x24733B");
    let blues = new CityGroupModel([], "0x0541CA");
    let cards = [
        //{
        //    "type": "station",
        //    "value" : new StationModel(14, "ATG", [50,100,200,400,600,1000], 25, 50, 10, null, false, Globals.resources.station)
        //},
        {
            "type" : "city",
            "value" : new CityModel(1, "Ankara",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, browns)
        },
        {
            "type" : "city",
            "value" : new CityModel(2, "IZMIR", [50,100,200,400,600,1000], 25, 50,10 , null, 200, 200, null, lightBlues)
        },
        {
            "type" : "city",
            "value" : new CityModel(3, "KONYA", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, pinks)
        },
        {
            "type" : "city",
            "value" : new CityModel(4, "ISTANBUL", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, oranges)
        },
        {
            "type" : "city",
            "value" : new CityModel(5, "NORTH CAROLINA EVULINE",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, reds)
        },
        {
            "type" : "city",
            "value" : new CityModel(6, "IZMIR", [50,100,200,400,600,1000], 25, 50,10 , null, 200, 200, null, yellows)
        },
        {
            "type" : "city",
            "value" : new CityModel(7, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, greens)
        },
        {
            "type" : "city",
            "value" : new CityModel(8, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, blues)
        },
        {
            "type" : "city",
            "value" : new CityModel(9, "Ankara",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, browns)
        },
        {
            "type" : "city",
            "value" : new CityModel(10, "IZMIR", [50,100,200,400,600,1000], 25, 50,10 , null, 200, 200, null, lightBlues)
        },
        {
            "type" : "city",
            "value" : new CityModel(11, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, pinks)
        },
        {
            "type" : "city",
            "value" : new CityModel(12, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, oranges)
        },
        {
            "type" : "city",
            "value" : new CityModel(13, "Ankara",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, reds)
        },
        {
            "type" : "city",
            "value" : new CityModel(14, "IZMIR", [50,100,200,400,600,1000], 25, 50,10 , null, 200, 200, null, yellows)
        },
        {
            "type" : "city",
            "value" : new CityModel(15, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, greens)
        },
        {
            "type" : "city",
            "value" : new CityModel(16, "IZMIR", [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, blues)
        },
        {
            "type" : "city",
            "value" : new CityModel(17, "Ankara",  [50,100,200,400,600,1000], 25, 50, 10, null, 200, 200, null, browns)
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

    let cardExs = [];
    let selectedCardId = -1;
    let isClickedCard = false;
    let cardCount = 16;
    function offset(selectedId) {
        if(selectedCardId !== -1) return;
        let foundUp =false;
        let foundDown =false;
        for (let i = 0; i < cardCount; i++) {
            if(i < 10){
                if (!foundUp) {
                    cardExs[i].card.x =cardExs[i].card.oldx +  i * 30;
                }
                else {
                    cardExs[i].card.x = cardExs[i].card.oldx + i * 30 + 120;
                }
                if (cardExs[i].id === selectedId) {
                    foundUp =true;
                }
            }else{
                if (!foundDown) {
                    cardExs[i].card.x =cardExs[i].card.oldx +  (i-10) * 30;
                }
                else {
                    cardExs[i].card.x = cardExs[i].card.oldx + (i-10) * 30 + 120;
                }
                if (cardExs[i].id === selectedId) {
                    foundDown =true;
                }
            }
        }
    }

    let maxWidth = 100;
    if(cardCount >= 2)
        maxWidth = (cardCount-2)*30 + 205;
    for(let i = 0; i < cardCount; i++) {
        let type = cards[i]["type"];
        let value = cards[i]["value"];
        let cardEx;
        if (type === "city"){
            cardEx = new CityCardView(value);
        }else if(type === "station"){
            cardEx = new StationCardView(value);
        }
        else if(type === "special"){
            console.log("special card is not ready.");
        }
        cardEx.setCallBack((selectedId) =>{
            offset(selectedId);
        },(selectedId)=>{
            if(selectedCardId != -1) return;
            for (let i = 0; i < cardCount; i++) {
                if(i < 10) {
                    cardExs[i].card.x = cardExs[i].card.oldx + i * 30;
                }else {
                    cardExs[i].card.x = cardExs[i].card.oldx + (i - 10) * 30;
                }
            }
        }, (card)=>{
            if(selectedCardId !== -1){
                for (let i = 0; i < cardCount; i++) {
                    if(i < 10)
                        cardExs[i].card.x = cardExs[i].card.oldx + i * 30;
                    else
                        cardExs[i].card.x = cardExs[i].card.oldx + (i-10) * 30;
                    if(cardExs[i].id === selectedCardId)
                        cardExs[i].selectedBorder.destroy();
                    cardExs[i].card.removeChild(cardExs[i].selectedBorder);
                }
                selectedCardId = -1;
            }
            offset(card.id);
            selectedCardId = card.id;
            card.selectedBorder = new PIXI.Graphics();
            card.selectedBorder.name = "selectedBorder";
            card.selectedBorder.lineStyle(5, 0x000);
            card.selectedBorder.drawRect(0, 0, 150, 200);
            card.selectedBorder.position.set(card.border.x,card.border.y);
            card.card.addChild(card.selectedBorder);
            console.log("SELECTED CARD: " + selectedCardId);
            isClickedCard = true;
        });

        if(i >= 10){
            cardEx.card.x = (720 - maxWidth) / 2;
            cardEx.card.oldx = cardEx.card.x;
            cardEx.card.x += (i-10) * 30;
            cardEx.card.y += 210;
        }else{
            cardEx.card.x = (720 - maxWidth) / 2;
            cardEx.card.oldx = cardEx.card.x;
            cardEx.card.x += i * 30;
        }
        cardExs.push(cardEx);
    }
}

function GameScreen(props) {
    const [isScoreboardOpen, setIsScoreboardOpen] = React.useState(false);
    const [currentState, setCurrentState] = React.useState({});

    useEffect(()=>{
        initPixi();
    }, []);
    return (
        <div className="canvasDiv" style={{display: "grid", gridTemplateColumns: "720px 880px"}}>
            <div style={{width: 720, display:"grid", gridTemplateRows:"1fr 1fr", gridTemplateColumns: "1fr"}}>
                <div style={{backgroundColor: "#CEE5D1"}}>
                    <Card style={{margin: "20px", padding: "20px", backgroundColor: "#a9dbb0"}} elevation={2}>
                        <Button intent={"warning"} onClick={()=>setIsScoreboardOpen(!isScoreboardOpen)}>Scoreboard</Button>
                        <YourTurnState/>
                    </Card>
                    <Widget />
                    <Drawer
                        isOpen={isScoreboardOpen}
                        canOutsideClickClose={true}
                        hasBackdrop={true}
                        isCloseButtonShown={true}
                        title="Scoreboard"
                        autoFocus= "true"
                        canEscapeKeyClose= "true"
                        enforceFocus= "true"
                        position={Position.LEFT}
                        size={500}
                        onClose={() => setIsScoreboardOpen(false)}
                        usePortal= "true">
                        SELAM
                    </Drawer>
                </div>
                <div id="canvas_hand" />
            </div>
            <div id="canvas" />
        </div>
    );
}

export default GameScreen;