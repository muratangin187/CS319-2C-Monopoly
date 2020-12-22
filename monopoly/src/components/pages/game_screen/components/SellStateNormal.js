import {Button, Card} from "@blueprintjs/core";
import React from "react";
import {ipcRenderer} from "electron";
import BoardManager from "../../../boardManager";
import { AppToaster } from "../../../toaster";

export default function SellStateNormal(props) {
    function sell_property(){
        if(BoardManager.getCardID() === -1){
            AppToaster.show({message: "Please select a property", intent:"danger"});
        }
        else
            ipcRenderer.send("sell_property_fb", BoardManager.getCardID());
    }

    function sell_building_house(){

        if(BoardManager.getCardID() === -1){
            AppToaster.show({message: "Please select a property", intent:"danger"});
        }
        else
            ipcRenderer.send("sell_building_house_fb", BoardManager.getCardID());
    }
    function sell_building_hotel(){

        if(BoardManager.getCardID() === -1){
            AppToaster.show({message: "Please select a property", intent:"danger"});
        }
        else
            ipcRenderer.send("sell_building_hotel_fb", BoardManager.getCardID());
    }

    function goBack(){
        ipcRenderer.send("goBack_fb", true);
    }

    return (
        <>
            <Card style={{margin: "20px"}} elevation={2}>
                <h3 style={{textAlign: "center"}}>You need to sell city or building to pay</h3>
                <Card style={{margin: "20px", textAlign: "center", backgroundColor: "#CEE5D1"}} elevation={2}>
                    <Button intent="primary" onClick={sell_property}>Sell Property</Button>
                    <Button intent="warning" onClick={sell_building_house}>Sell House</Button>
                    <Button intent="warning" onClick={sell_building_hotel}>Sell Hotel</Button>
                    <Button intent="primary" onClick={goBack}>Back</Button>

                </Card>
            </Card>
        </>
    );
}
