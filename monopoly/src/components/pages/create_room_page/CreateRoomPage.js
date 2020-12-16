import React from "react";
import CreateRoom from "./components/CreateRoom";
import Header from "../common/Header";

function CreateRoomPage(props) {
    return (
        <div className="createRoomPage">
            <Header setPage={props.setPage} prevPageName="roomOptionPage" prevPageTitle="Main Menu"/>
            <CreateRoom setRooms={props.setRooms}/>
        </div>
    );
}

export default CreateRoomPage;