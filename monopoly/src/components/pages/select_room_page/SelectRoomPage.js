import React, {useEffect, useState} from "react";
import RoomList from "./components/RoomList";
import Header from "../common/Header";
const {ipcRenderer} = require('electron');

function SelectRoomPage(props){
    return(
        <div className="selectRoomPage">
            <Header setPage={props.setPage} prevPageName="roomOptionPage" prevPageTitle="Room Option Page" />
            <RoomList rows = {props.rooms} />
        </div>
    );
}

export default SelectRoomPage;