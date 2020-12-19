import {Button, Card} from "@blueprintjs/core";
import ReactDice from "react-dice-complete";
import React from "react";
const {ipcRenderer} = require('electron');

export default function DetermineStartOrder(props) {
    const [reactDice, setReactDice] = React.useState(null);
    function rollAll() {
        reactDice.rollAll()
    }

    function determineStartOrder(sum){
        ipcRenderer.send("determineStartOrder_fb", sum);
    }
    return (
        <>
            <Card style={{margin: "20px",backgroundColor: "#CEE5D1"}} elevation={2}>
                <h3 style={{textAlign: "center"}}>Please roll dice in order to determine order of playing</h3>
            </Card>
            <Card style={{margin: "20px", textAlign: "center", backgroundColor: "#CEE5D1"}} elevation={2}>
                <ReactDice
                    numDice={2}
                    rollDone={determineStartOrder}
                    ref={dice => setReactDice(dice)}
                    dotColor="#000000"
                    faceColor="#a9dbb0"
                    outline="true"
                    outlineColor="#575757"
                    disableIndividual="true"
                />
                <Button onClick={rollAll} intent={"success"}>Roll</Button>
            </Card>
        </>
    );
}
