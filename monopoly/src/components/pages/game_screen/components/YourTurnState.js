import {Button, Card} from "@blueprintjs/core";
import ReactDice from "react-dice-complete";
import React from "react";
const {ipcRenderer} = require('electron');

export default function YourTurnState() {
    const [reactDice, setReactDice] = React.useState(null);

    function rollAll() {
        reactDice.rollAll()
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
                        ipcRenderer.send("move_player_fb", rolledDice);
                    }}
                    ref={dice => setReactDice(dice)}
                    dotColor="#000000"
                    faceColor="#a9dbb0"
                    outline="true"
                    outlineColor="#575757"
                    disableIndividual="true"
                />
                <Button onClick={()=>{rollAll();}} intent={"success"}>Roll</Button>
            </Card>
        </>
    );
}
