import {Button, Card} from "@blueprintjs/core";
import React from "react";
import {ipcRenderer} from "electron";

export default function BuyPropertyState(props) {
    function buy(){
       ipcRenderer.send("buy_property_fb", props.propertyModel);
    }

    function pass(){

    }

    return (
        <>
        <Card style={{margin: "20px"}} elevation={2}>
            <h3 style={{textAlign: "center"}}>Do you want to buy {props.propertyModel.name} for {props.propertyModel.price}$</h3>
            <Card style={{margin: "20px", textAlign: "center", backgroundColor: "#CEE5D1"}} elevation={2}>
                <Button intent="success" onClick={buy}>Buy</Button>
                <Button intent="danger" onClick={pass}>Pass</Button>
            </Card>
        </Card>
        </>
    );
}
