import React, {useEffect, useState} from "react";
import {addResponseMessage, addUserMessage, Widget} from 'react-chat-widget';
const {ipcRenderer} = require('electron');

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
import OtherPropertyTileView from "../../../views/tileView/otherPropertyTileView";
import CityTileView from "../../../views/tileView/cityTileView";
import CityCardView from "../../../views/cardView/cityCardView";
import SpecialTileView from "../../../views/tileView/specialTileView";
import Character from "../../../views/tileView/Character";
import UtilityCardView from "../../../views/cardView/utilityCardView";
import {Button, Card, Drawer, Position, Elevation, Collapse, Pre, H6, Icon} from "@blueprintjs/core";
import ReactDice from 'react-dice-complete'
import YourTurnState from "./components/YourTurnState";
import OtherPlayersTurn from "./components/OtherPlayersTurn";
import StationCardView from "../../../views/cardView/stationCardView";
import DetermineStartOrder from "./components/DetermineStartOrder";
import BoardManager from "../../boardManager";
import BuyPropertyState from "./components/BuyPropertyState";

import PlayerModel from "../../../models/playerModel";
import CityModel from "../../../models/cityModel";
import StationModel from "../../../models/stationModel";
import UtilityModel from "../../../models/utilityModel";
import BuildingModel from "../../../models/buildingModel";

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
                let station = new StationModel(id, name,  rentPrice, mortgagePrice, price, tile, false, image);
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
                let city = new CityModel(id, name,  rentPrice, mortgagePrice, price, tile, houseCost, hotelCost, null, color);
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
                let utility = new UtilityModel(tile, name,  rentPrice, mortgagePrice, price, tile, false, image);
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
        {
            "type": "station",
            "value" : new StationModel(30, "ATG", [50,100,200,400,600,1000], 25, 50, 10, null, false, Globals.resources.station)
        },
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
            card.selectedBorder.drawRect(0, 0, 150, 242);
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

let house1 = new BuildingModel("house", 10);
let house2 = new BuildingModel("house", 10);
let house3 = new BuildingModel("house", 10);
let hostel1 = new BuildingModel("hostel", 10);

let city1 = new CityModel(1, "city1", 10, 10, 10, 1, 10, 10, [house1, house2, house3], "purple");
let city2 = new CityModel(2, "city2", 10, 10, 10, 2, 10, 10, [hostel1], "red");
let city3 = new CityModel(3, "city3", 10, 10, 10, 2, 10, 10, [house1, house2], "blue");
let city4 = new CityModel(4, "city4", 10, 10, 10, 2, 10, 10, [house1, house2], "aquamarine");
let city5 = new CityModel(5, "city5", 10, 10, 10, 2, 10, 10, [house1, house2], "green");
let city6 = new CityModel(6, "city6", 10, 10, 10, 2, 10, 10, [house1, house2], "pink");
let city7 = new CityModel(7, "city7", 10, 10, 10, 2, 10, 10, [house1, house2], "orange");
let city8 = new CityModel(8, "city8", 10, 10, 10, 2, 10, 10, [house1, house2], "yellow");

let station1 = new StationModel(1, "station1", 10, 10, 10, 3, false, "");
let station2 = new StationModel(2, "station2", 10, 10, 10, 4, false, "");

let utility1 = new UtilityModel(1, "utility1", 10, 10, 10, 5, false, "");
let utility2 = new UtilityModel(2, "utility2", 10, 10, 10, 6, false, "");

let player1 = new PlayerModel(1, "umityigitbsrn", null, null, 1);
player1.properties = [city1, station1, utility1, city2, station2, utility2, city3];

let player2 = new PlayerModel(2, "murata42", null, null, 1);
player2.properties = [city1, station1, utility1, city2, station2, utility2, city3, city4, city5, city6, city7, city8];

let users = [player1, player2];

function GameScreen(props) {
    const [isScoreboardOpen, setIsScoreboardOpen] = React.useState(false);
    const [currentState, setCurrentState] = React.useState({stateName:"determineStartOrder", payload:{}});
    const [currentView, setCurrentView] = React.useState(null);

    const [collapseOpen, setCollapseOpen] = useState([]);
    const [cityExpand, setCityExpand] = useState([]);
    const [stationExpand, setStationExpand] = useState([]);
    const [utilityExpand, setUtilityExpand] = useState([]);

    function handleOpenCollapse(index){
        let tmpCollapseOpen = [...collapseOpen];
        tmpCollapseOpen[index] = !collapseOpen[index];
        setCollapseOpen(tmpCollapseOpen);
    }

    function handleCityCollapse(index){
        let tmpCollapseOpen = [...cityExpand];
        tmpCollapseOpen[index] = !cityExpand[index];
        setCityExpand(tmpCollapseOpen);
    }

    function handleStationCollapse(index){
        let tmpCollapseOpen = [...stationExpand];
        tmpCollapseOpen[index] = !stationExpand[index];
        setStationExpand(tmpCollapseOpen);
    }

    function handleUtilityCollapse(index){
        let tmpCollapseOpen = [...utilityExpand];
        tmpCollapseOpen[index] = !utilityExpand[index];
        setUtilityExpand(tmpCollapseOpen);
    }

    const handleNewUserMessage = (newMessage) => {
        ipcRenderer.send('send_message_widget_fb', {sendBy: props.currentUser.username, message: newMessage});
    };

    useEffect(()=>{
        //initPixi();
        ipcRenderer.on("next_state_bf", (event, stateObject)=>{
            setCurrentState(stateObject);
        });
        //BoardManager.initializeGame({});
        ipcRenderer.on("move_player_bf", (event, args)=>{
            let playerId = args.playerId;
            let destinationTileId = args.destinationTileId;
            console.log("USER: " + playerId + " MOVED TO " + destinationTileId);
        });

        ipcRenderer.on('send_message_widget_bf', (event, messageObj) => {
            addResponseMessage(messageObj.sendBy + ": " + messageObj.message);
        });

    }, []);

    const styles = {
        drawer_scoreboard: {
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
        },
        card_scoreboard: {
            margin: 8,
            padding: 2,
            display: "grid",
            gridTemplateRows: "24px auto",
            gridTemplateAreas: `
                "header"
                "main"
            `
        },
        header_scoreboard: {
            gridArea: "header",
            display: "grid",
            gridTemplateRows: "auto",
            gridTemplateColumns: "auto auto",
            gridTemplateAreas: `
                "username money"
            `,
        },
        username: {
            gridArea: "username",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "aquamarine",
        },
        money: {
            gridArea: "money",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "aquamarine",
        },
        main_scoreboard: {
            gridArea: "main",
            display: "flex",
            flexDirection: "column",
        },
        button_scoreboard: {

        },
        card_collapse: {
            margin: 8,
            padding: 2,
        },
        before_card: {
            display: "grid",
            gridTemplateColumns: "auto auto",
            gridTemplateAreas: `
                "stat1 stat2"
            `,
            marginBottom: 4,
        },
        stat1: {
            gridArea: "stat1",
        },
        stat2: {
            gridArea: "stat2",
            display: "flex",
            justifyContent: "flex-end",
        },
        icon: {
            marginLeft: 8,
            marginRight: 8,
        },
    };

    return (
        <div className="canvasDiv" style={{display: "grid", gridTemplateColumns: "720px 880px"}}>
            <div style={{width: 720, display:"grid", gridTemplateRows:"1fr 1fr", gridTemplateColumns: "1fr"}}>
                <div style={{backgroundColor: "#CEE5D1"}}>
                    <Card style={{margin: "20px", padding: "20px", backgroundColor: "#a9dbb0"}} elevation={2}>
                        <Button intent={"warning"} onClick={()=>setIsScoreboardOpen(!isScoreboardOpen)}>Scoreboard</Button>
                        {currentState.stateName === "determineStartOrder"
                            ? (<DetermineStartOrder/>) : currentState.stateName === "playNormalTurn"
                                ? (<YourTurnState/>) : currentState.stateName === "inJailTurn" ? (<JailTurn/>) :
                                    currentState.stateName === "buyNewProperty" ? (<BuyPropertyState propertyModel={currentState.payload}/>) : (<OtherPlayersTurn/>)}
                    </Card>
                    <Widget
                        handleNewUserMessage={handleNewUserMessage}
                        title="Chat"
                        subtitle="In-game chat"
                    />
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
                        usePortal= "true"
                        style={styles.drawer_scoreboard}
                    >
                        {users.map((user, index) => {
                            function userStatistics(){
                                let cities = [];
                                let stations = [];
                                let utilities = [];
                                let numberOfHouses = 0;
                                let numberOfHostels = 0;
                                let colors = {
                                    purple: 0,
                                    aquamarine: 0,
                                    pink: 0,
                                    orange: 0,
                                    red: 0,
                                    yellow: 0,
                                    green: 0,
                                    blue: 0,
                                };

                                for (let i = 0; i < user.properties.length; i++){
                                    if (user.properties[i].type === "CityModel") {
                                        cities.push(user.properties[i]);
                                        for (let j = 0; j < user.properties[i].buildings.length; j++){
                                            if (user.properties[i].buildings[j].type === "house")
                                                numberOfHouses++;
                                            else if (user.properties[i].buildings[j].type === "hostel")
                                                numberOfHostels++;
                                        }
                                    }
                                    else if (user.properties[i].type === "StationModel")
                                        stations.push(user.properties[i]);
                                    else if (user.properties[i].type === "UtilityModel")
                                        utilities.push(user.properties[i]);
                                }

                                for (let i = 0; i < cities.length; i++){
                                    if (cities[i].color === "purple")
                                        colors.purple++;
                                    else if (cities[i].color === "aquamarine")
                                        colors.aquamarine++;
                                    else if (cities[i].color === "pink")
                                        colors.pink++;
                                    else if (cities[i].color === "orange")
                                        colors.orange++;
                                    else if (cities[i].color === "red")
                                        colors.red++;
                                    else if (cities[i].color === "yellow")
                                        colors.yellow++;
                                    else if (cities[i].color === "green")
                                        colors.green++;
                                    else if (cities[i].color === "blue")
                                        colors.blue++;

                                    console.log("City: " + cities[i].color);
                                }

                                return {cities: cities, stations: stations, utilities: utilities, numberOfHouses: numberOfHouses, numberOfHostels: numberOfHostels, colors: colors};
                            }

                            let statisticObj = userStatistics();
                            return(
                                <div key={index}>
                                    <Card interactive={true} elevation={Elevation.TWO} style={styles.card_scoreboard}>
                                        <div style={styles.header_scoreboard}>
                                            <div style={styles.username}><H6 style={{marginBottom: 0}}>Username: {user.username}</H6></div>
                                            <div style={styles.money}><H6 style={{marginBottom: 0}}>Money: {user.money}</H6> <Icon icon="dollar" iconSize={16}/> </div>
                                        </div>
                                        <div style={styles.main_scoreboard}>
                                            <div style={{marginTop: 8, marginBottom: 8}}>
                                                <div style={styles.before_card}>
                                                    <H6 style={styles.stat1}>City</H6>
                                                    <div style={styles.stat2}>
                                                        {Object.keys(statisticObj.colors).map(color => {

                                                            console.log(statisticObj.colors[color]);

                                                            if (statisticObj.colors[color] !== 0)
                                                                return <div style={styles.icon}><Icon icon="tag" color={color}/> {statisticObj.colors[color]}/3</div>;
                                                            else
                                                                return <></>;
                                                        })}
                                                    </div>
                                                </div>
                                                <div style={styles.before_card}>
                                                    <H6 style={styles.stat1}>Station</H6>
                                                    <div style={styles.stat2}>
                                                        <div style={styles.icon}><Icon icon="path" /> {statisticObj.stations.length}/4</div>
                                                    </div>
                                                </div>
                                                <div style={styles.before_card}>
                                                    <H6 style={styles.stat1}>Utility</H6>
                                                    <div style={styles.stat2}>
                                                        <div style={styles.icon}><Icon icon="help" /> {statisticObj.utilities.length}/2</div>
                                                    </div>
                                                </div>
                                                <Collapse isOpen={collapseOpen[index]}>
                                                    <div style={{marginTop: 8, marginBottom: 8}}>
                                                        <H6>City</H6>
                                                        <div style={styles.before_card}>
                                                            <div style={styles.stat1}>Total # of cities: {statisticObj.cities.length}</div>
                                                            <div style={styles.stat2}>
                                                                <div style={styles.icon}><Icon icon="home" color="red"/> : {statisticObj.numberOfHouses}</div>
                                                                <div style={styles.icon}><Icon icon="office" color="orange  "/> : {statisticObj.numberOfHostels}</div>
                                                            </div>
                                                        </div>
                                                        <Collapse isOpen={cityExpand[index]}>
                                                            <Card interactive={true} elevation={Elevation.ONE} style={styles.card_collapse}>
                                                                {statisticObj.cities.map((city) => {
                                                                    function cityStatistics(){
                                                                        let numHouse = 0;
                                                                        let numHostel = 0;

                                                                        for (let i = 0; i < city.buildings.length; i++){
                                                                            if (city.buildings[i].type === "house")
                                                                                numHouse++;
                                                                            else if (city.buildings[i].type === "hostel")
                                                                                numHostel++;
                                                                        }

                                                                        return {numHouse: numHouse, numHostel: numHostel};
                                                                    }

                                                                    let statisticObjCity = cityStatistics();
                                                                    return (
                                                                        <div style={styles.before_card}>
                                                                            <div style={styles.stat1}>City: {city.name}</div>
                                                                            <div style={styles.stat2}>
                                                                                <div style={styles.icon}><Icon icon="tag" color={city.color}/></div>
                                                                                <div style={styles.icon}><Icon icon="home" color="red"/> : {statisticObjCity.numHouse}</div>
                                                                                <div style={styles.icon}><Icon icon="office" color="orange"/> : {statisticObjCity.numHostel}</div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </Card>
                                                        </Collapse>
                                                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                                                            <Button small={true} icon="expand-all" minimal={true} style={styles.button_scoreboard} onClick={() => handleCityCollapse(index)}/>
                                                        </div>
                                                    </div>
                                                    <div style={{marginTop: 8, marginBottom: 8}}>
                                                        <H6>Station</H6>
                                                        <p>Total # of stations: {statisticObj.stations.length}</p>
                                                        <Collapse isOpen={stationExpand[index]}>
                                                            <Card interactive={true} elevation={Elevation.ONE} style={styles.card_collapse}>
                                                                {statisticObj.stations.map((station) => {
                                                                    return (
                                                                        <div>
                                                                            Station: {station.name}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </Card>
                                                        </Collapse>
                                                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                                                            <Button small={true} icon="expand-all" minimal={true} style={styles.button_scoreboard} onClick={() => handleStationCollapse(index)}/>
                                                        </div>
                                                    </div>
                                                    <div style={{marginTop: 8, marginBottom: 8}}>
                                                        <H6>Utility</H6>
                                                        <p>Total # of utilities: {statisticObj.utilities.length}</p>
                                                        <Collapse isOpen={utilityExpand[index]}>
                                                            <Card interactive={true} elevation={Elevation.ONE} style={styles.card_collapse}>
                                                                {statisticObj.utilities.map((utility) => {
                                                                    return (
                                                                        <div>
                                                                            Utility: {utility.name}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </Card>
                                                        </Collapse>
                                                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                                                            <Button small={true} icon="expand-all" minimal={true} style={styles.button_scoreboard} onClick={() => handleUtilityCollapse(index)}/>
                                                        </div>
                                                    </div>
                                                </Collapse>
                                                <div style={{display: "flex", justifyContent: "flex-end"}}>
                                                    <Button small={true} icon="expand-all" minimal={true} style={styles.button_scoreboard} onClick={() => handleOpenCollapse(index)}/>
                                                </div>
                                            </div>

                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    </Drawer>
                </div>
                <div id="canvas_hand" />
            </div>
            <div id="canvas" />
        </div>
    );
}

export default GameScreen;