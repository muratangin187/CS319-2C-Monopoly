import {Button, Card} from "@blueprintjs/core";
import React from "react";

export default function BidOtherPlayerTurn(props) {
    return (
        <>
        <Card style={{margin: "20px"}} elevation={2}>
            <h3 style={{textAlign: "center"}}>Auction for {props.arg.propertyModel.name}</h3>
            {console.log("Auction: " + JSON.stringify(props.arg.auction))}
            <Card>
                {Object.keys(props.arg.auction).map((id, i) => (
                    <li className="travelcompany-input" key={i}>
                        <span className="input-label">Name: {props.arg.auction[id].name.username} Bid: {props.arg.auction[id].bid}</span>
                    </li>
                ))}
            </Card>

        </Card>
        </>
    );
}
