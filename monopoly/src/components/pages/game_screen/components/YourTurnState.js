import {Button, Card} from "@blueprintjs/core";
import ReactDice from "react-dice-complete";
import React from "react";
const {ipcRenderer} = require('electron');
import BoardManager from "../../../boardManager";
import { AppToaster } from "../../../toaster";

export default function YourTurnState() {
    const [reactDice, setReactDice] = React.useState(null);

    function rollAll() {
        reactDice.rollAll()
    }

    function buyBuilding(type){
        if(BoardManager.selectedCardId !==-1)
            ipcRenderer.send("set_building_fb" , {id: BoardManager.selectedCardId, type: type});
        else
            AppToaster.show({message: "You need to select a card", intent:"danger"});
    }

    return (
        <>
            <Card style={{margin: "20px",backgroundColor: "#CEE5D1"}} elevation={2}>
                <h3 style={{textAlign: "center"}}>Your turn, roll dice</h3>
            </Card>
            <Card style={{margin: "20px", textAlign: "center", backgroundColor: "#CEE5D1"}} elevation={2}>
                <ReactDice
                    numDice={2}
                    rollDone={(sum, rolledDice)=>{
                        ipcRenderer.send("move_player_fb", [0,1]);
                    }}
                    ref={dice => setReactDice(dice)}
                    dotColor="#000000"
                    faceColor="#a9dbb0"
                    outline="true"
                    outlineColor="#575757"
                    disableIndividual="true"
                />
                <Button onClick={()=>{rollAll();}} intent={"success"}>Roll</Button>
                <Button onClick={()=>{buyBuilding("house");}} intent={"success"}>Build House</Button>
                <Button onClick={()=>{buyBuilding("hotel");}} intent={"success"}>Build Hotel</Button>
            </Card>
        </>
    );
}
