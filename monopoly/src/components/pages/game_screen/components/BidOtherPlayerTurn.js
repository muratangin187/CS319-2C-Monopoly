import {Button, Card} from "@blueprintjs/core";
import React from "react";

export default function BidOtherPlayerTurn(props) {
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

        </Card>
        </>
    );
}
