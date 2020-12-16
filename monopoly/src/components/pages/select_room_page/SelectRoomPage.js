import React from "react";
import RoomList from "./components/RoomList";
import Header from "../common/Header";

const rows = [
    {
        name: "Room - 1",
        passRequired: "No",
        boardTemplate: "Template - 1",
    },
    {
        name: "Room - 2",
        passRequired: "Yes",
        boardTemplate: "Template - 2",
    },
    {
        name: "Room - 3",
        passRequired: "No",
        boardTemplate: "Template - 2",
    },
    {
        name: "Room - 4",
        passRequired: "No",
        boardTemplate: "Template - 1",
    }
];

function SelectRoomPage(props){
    return(
        <div className="selectRoomPage">
            <Header setPage={props.setPage} prevPageName="roomOptionPage" prevPageTitle="Room Option Page" />
            <RoomList rows = {props.rooms} />
        </div>
    );
}

export default SelectRoomPage;