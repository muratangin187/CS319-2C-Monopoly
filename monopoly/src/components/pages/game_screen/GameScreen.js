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
import StationModel from "../../../models/stationModel";
import OtherPropertyTileView from "../../../views/tileView/otherPropertyTileView";
import CityModel from "../../../models/cityModel";
import CityTileView from "../../../views/tileView/cityTileView";
import CityCardView from "../../../views/cardView/cityCardView";
import SpecialTileView from "../../../views/tileView/specialTileView";
import UtilityModel from "../../../models/utilityModel";
import Character from "../../../views/tileView/Character";
import UtilityCardView from "../../../views/cardView/utilityCardView";
import {Button, Card, Drawer, Position, Elevation, Collapse, Pre, H6, Icon, Tag} from "@blueprintjs/core";
import ReactDice from 'react-dice-complete'
import YourTurnState from "./components/YourTurnState";
import OtherPlayersTurn from "./components/OtherPlayersTurn";
import StationCardView from "../../../views/cardView/stationCardView";
import DetermineStartOrder from "./components/DetermineStartOrder";
import BoardManager from "../../boardManager";
import BuyPropertyState from "./components/BuyPropertyState";
import BidYourTurn from "./components/BidYourTurn";
import BidOtherPlayerTurn from "./components/BidOtherPlayerTurn";
import SellState from "./components/SellState";
import SellStateNormal from "./components/SellStateNormal";
import JailTurn from "./components/JailTurn";


function GameScreen(props) {
    const [isScoreboardOpen, setIsScoreboardOpen] = React.useState(false);
    const [currentState, setCurrentState] = React.useState({stateName:"determineStartOrder", payload:{}});
    const [currentView, setCurrentView] = React.useState(null);
    const [money, setMoney] = React.useState(1500);
    const [jailCard, setJailCard] = React.useState(false);
    const [users, setUsers] = React.useState([]);

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
            console.log(stateObject + "StateObject");
            setCurrentState(stateObject);
        });
        //BoardManager.initializeGame({});
        ipcRenderer.on("move_player_bf", (event, args)=>{
            let playerId = args.playerId;
            let destinationTileId = args.destinationTileId;
            console.log("USER: " + playerId + " MOVED TO " + destinationTileId);
        });

        ipcRenderer.on("addJailCard", (event, args)=>{
            setJailCard(args);
        });
        ipcRenderer.on("updatePlayerList", (event, args)=>{
            let temp = [];
            setTimeout(()=>{
                console.log("AAAAA");
                console.log(args);
                for(let index in args){
                    temp.push(args[index]);
                }
                setUsers(temp);
            }, 500);
        });
        ipcRenderer.on("update_money_indicator", (event, money)=>{
            setMoney(money);
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
                        <Button icon={jailCard ? "tick" : "cross"} intent={jailCard ? "success" : "danger"} style={{marginLeft: 10}}>Jail Card</Button>
                        <Button intent="primary" active={false} icon="dollar" style={{float:"right"}}>{money}</Button>
                        {currentState.stateName === "determineStartOrder"
                            ? (<DetermineStartOrder/>) : currentState.stateName === "playNormalTurn"
                                ? (<YourTurnState/>) : currentState.stateName === "waitInJail" ? (<JailTurn arg={currentState.payload}/>) :
                                    currentState.stateName === "buyNewProperty" ? (<BuyPropertyState propertyModel={currentState.payload}/>) :
                                        currentState.stateName === "BidYourTurn" ? (<BidYourTurn arg={currentState.payload} money={money}/>) :
                                            currentState.stateName === "BidOtherPlayerTurn" ? (<BidOtherPlayerTurn arg={currentState.payload} money={money}/>) :
                                                currentState.stateName ==="SellState" ? (<SellState arg={currentState.payload} money={money}/>):currentState.stateName === "SellStateNormal" ? (<SellStateNormal arg={currentState.payload} money={money}/>):currentState.stateName === "aa" ? (<JailTurn arg={currentState.payload}/>):(<OtherPlayersTurn/>)}
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
                                    brown: 0,
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
                                        numberOfHostels = user.properties[i].buildings.hotel;
                                        numberOfHouses = user.properties[i].buildings.house;
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