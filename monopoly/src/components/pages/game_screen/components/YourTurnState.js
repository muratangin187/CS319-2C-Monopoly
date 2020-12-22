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
    function sell(){
        ipcRenderer.send("sell_fb", 0);
    }

    function buyBuilding(type){
        if(BoardManager.selectedCardId !==-1)
            ipcRenderer.send("set_building_fb" , {id: BoardManager.selectedCardId, type: type});
        else
            AppToaster.show({message: "You need to select a card", intent:"danger"});
    }
    function characterSkill(){
        // if(BoardManager.selectedTileId !==-1)
        ipcRenderer.send("use_skill_fb", BoardManager.selectedTileId);
        // else
        //     AppToaster.show({message: "You need to select a tile", intent:"danger"});

    }
    return (
        <>
            <Card style={{margin: "20px",backgroundColor: "#cee5d1"}} elevation={2}>
                <h3 style={{textAlign: "center"}}>Your turn, roll dice</h3>
            </Card>
            <Card style={{margin: "20px", textAlign: "center", backgroundColor: "#CEE5D1"}} elevation={2}>
                <ReactDice
                    numDice={2}
                    rollDone={(sum, rolledDice)=>{
                        setTimeout(()=>{
                            rolledDice[0] = 10;
                            rolledDice[1] = 0;
                            ipcRenderer.send("move_player_fb", [rolledDice[0], rolledDice[1]]);
                        }, 1000);
                    }}
                    ref={dice => setReactDice(dice)}
                    dotColor="#000000"
                    faceColor="#a9dbb0"
                    outline="true"
                    outlineColor="#575757"
                    disableIndividual="true"
                />
                <Button onClick={()=>{characterSkill();}} intent={"success"}>Use Character Skill</Button>
                <Button onClick={()=>{rollAll();}} intent={"success"}>Roll</Button>
                <Button onClick={()=>{sell();}} intent={"warning"}>Sell Property</Button>
                <Button onClick={()=>{buyBuilding("house");}} intent={"success"}>Build House</Button>
                <Button onClick={()=>{buyBuilding("hotel");}} intent={"success"}>Build Hotel</Button>
            </Card>
        </>
    );
}
