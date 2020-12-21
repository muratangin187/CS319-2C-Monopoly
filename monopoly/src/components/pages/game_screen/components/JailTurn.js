import {Button, Card} from "@blueprintjs/core";
import ReactDice from "react-dice-complete";
import React from "react";
const {ipcRenderer} = require('electron');

export default function JailTurn(props) {
    const [reactDice, setReactDice] = React.useState(null);

    function rollAll() {
        reactDice.rollAll()
    }

    return (
        <>
            <Card style={{margin: "20px",backgroundColor: "#CEE5D1"}} elevation={2}>
                <h3 style={{textAlign: "center"}}>Only {props.arg.turnsLeft} chance left for double roll to exit</h3>
            </Card>
            <Card style={{margin: "20px", textAlign: "center", backgroundColor: "#CEE5D1"}} elevation={2}>
                <ReactDice
                    numDice={2}
                    rollDone={(sum, rollDice)=>{
                        if(rollDice[0] === rollDice[1]){
                            // exit from jail
                            ipcRenderer.send("exit_from_jail", {rolledDice: rollDice, type: 1});
                        }else{
                            if(props.arg.turnsLeft === 1){
                                ipcRenderer.send("exit_from_jail", {rolledDice: rollDice, type: 1});
                            }else{
                                // stay in jail
                                ipcRenderer.send("exit_from_jail", {type: 0});
                            }
                        }
                    }}
                    ref={dice => setReactDice(dice)}
                    dotColor="#000000"
                    faceColor="#a9dbb0"
                    outline="true"
                    outlineColor="#575757"
                    disableIndividual="true"
                />
                <Button onClick={rollAll} intent={"success"}>Roll to exit</Button>
                <Button disabled={props.arg.turnsLeft === 1} onClick={()=>ipcRenderer.send("exit_from_jail", {type:2})} intent={"success"}>Pay to exit</Button>
                <Button disabled={!props.arg.haveCard || props.arg.turnsLeft === 1} onClick={()=>ipcRenderer.send("exit_from_jail", {type:3})} intent={"success"}>Use card to exit</Button>
            </Card>
        </>
    );
}
