import React, {useEffect, useState} from "react";
import RoomList from "./components/RoomList";
import Header from "../common/Header";
const {ipcRenderer} = require('electron');

function SelectRoomPage(props){
    const [rooms, setRooms] = useState([]);

    useEffect( () => {
        function get_room_listener(event, args){
            setRooms(args);
        };

        //component mount
        ipcRenderer.on("get_rooms_bf", get_room_listener);

        ipcRenderer.send("get_rooms_fb");

        //component unmount
        return () => {
            ipcRenderer.removeListener("get_room_bf", get_room_listener);
        }
    }, [rooms]);

    return(
        <div className="selectRoomPage">
            <Header setPage={props.setPage} prevPageName="roomOptionPage" prevPageTitle="Room Option Page" />
            <RoomList rows = {rooms} />
        </div>
    );
}

export default SelectRoomPage;