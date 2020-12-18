import {Button, Card} from "@blueprintjs/core";
import ReactDice from "react-dice-complete";
import React from "react";
const {ipcRenderer} = require('electron');

export default function YourTurnState(props) {
    const [reactDice, setReactDice] = React.useState(null);

    function rollAll() {
        reactDice.rollAll()
    }

    function movePlayer(sum, rollArr){
        console.log(rollArr[0] + " | " + rollArr[1]);
        ipcRenderer.send("move_player_fb", {userModel: props.currentUser, movementAmount: sum});
    }

    return (
        <>
        <Card style={{margin: "20px"}} elevation={2}>
            <h3 style={{textAlign: "center"}}>Your turn, please roll dice</h3>
        </Card>
        <Card style={{margin: "20px", textAlign: "center"}} elevation={2}>
            <ReactDice
                numDice={2}
                rollDone={movePlayer}
                ref={dice => setReactDice(dice)}
                dotColor="#000000"
                faceColor="#ffffff"
                outline="true"
                outlineColor="#575757"
                disableIndividual="true"
            />
            <Button onClick={rollAll} intent={"success"}>Roll</Button>
        </Card>
        </>
    );
}
