import React from "react";
import Header from "../common/Header";
import RoomOptionBody from "./components/RoomOptionBody";

function RoomOptionPage(props){
    return (
        <div className="roomOptionPage">
            <Header setPage={props.setPage} prevPageName="mainPage" prevPageTitle="Main Menu"/>
            <RoomOptionBody setPage={props.setPage}/>
        </div>
    );
}

export default RoomOptionPage;