import {Button, Card} from "@blueprintjs/core";
import ReactDice from "react-dice-complete";
import React from "react";

export default function OtherPlayersTurn(props) {
    return (
        <>
        <Card style={{margin: "20px"}} elevation={2}>
            <h3 style={{textAlign: "center"}}>You need to wait other players' turn</h3>
        </Card>
        </>
    );
}
