import {Button, Card, NumericInput, Slider} from "@blueprintjs/core";
import React, {useEffect} from "react";
const {ipcRenderer} = require('electron');
import { AppToaster } from "../../../toaster";

export default function BidYourTurn(props){
    const [bidAmount, setBidAmount] = React.useState(0);
    const [maxAmount, setMaxAmount] = React.useState(0);
    const [canBid, setCanBid] = React.useState(true);

    useEffect(()=>{
        let maxAmountt = 0;
        for ( let id in props.arg.auction){
            if (maxAmountt < props.arg.auction[id].bid){
                maxAmountt = props.arg.auction[id].bid;
                setMaxAmount(maxAmountt);
            }
        }
    }, []);
    return (
        <>
        <Card style={{margin: "20px"}} elevation={2}>
            <h3 style={{textAlign: "center"}}>Auction for {props.arg.propertyModel.name}</h3>
            <Card>
                Rent price: {props.arg.propertyModel.rentPrice[0]}
                Rent price with 1 House: {props.arg.propertyModel.rentPrice[1]}
                Rent price with 2 House: {props.arg.propertyModel.rentPrice[2]}
                Rent price with 3 House: {props.arg.propertyModel.rentPrice[3]}
                Rent price with 4 House: {props.arg.propertyModel.rentPrice[4]}
                Rent price with a Hotel: {props.arg.propertyModel.rentPrice[5]}
                Mortgage price: {props.arg.propertyModel.mortgagePrice}
                Regular price: {props.arg.propertyModel.price}
            </Card>
            {/*<Card>*/}
            {/*    {Object.keys(props.arg.auction).map((id, i) => (*/}
            {/*        <li className="travelcompany-input" key={i}>*/}
            {/*            <span className="input-label">key: {i} Name: {props.arg.auction[id].name} Bid: {props.arg.auction[id].bid}</span>*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</Card>*/}
            <NumericInput minorStepSize={1} leftIcon="dollar" intent="warning" onValueChange={(value,a,b)=>setBidAmount(value)}/>
            <Button intent="primary" disabled={!canBid} onClick={()=>{
                if(maxAmount > bidAmount || bidAmount > props.money){
                    if(maxAmount > props.money){
                        AppToaster.show({message: "You dont have enough money to enter auction.", intent: "danger"});
                        setCanBid(false);
                    }else{
                        AppToaster.show({message: "Please enter a value between " + maxAmount + " and" + props.money, intent: "danger"});
                    }
                }else{
                    ipcRenderer.send("auction_fb", {propertyModel: props.arg.propertyModel, bidAmount: bidAmount});
                }
            }}>Bid</Button>
            <Button intent="danger" onClick={()=>{ipcRenderer.send("auction_fb", {propertyModel: props.arg.propertyModel, bidAmount: -1})}}>Pass</Button>
        </Card>
        </>
    );
}
