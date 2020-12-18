import React, {useEffect} from "react";
import Header from "../common/Header";
import PlayerList from "./components/PlayerList"
import Chat from "./components/Chat"
import CharacterList from "./components/CharacterList";
import {Button} from "@blueprintjs/core";
const {ipcRenderer} = require('electron');


function RoomLobbyPage(props) {
    const [roomUsers, setRoomUsers] = React.useState(props.room.roomUsers);
    const [selectedCharId, setSelectedCharId] = React.useState(-1);
    const roomLeader = props.room.roomUsers[0];
    const currentUser = props.currentUser;

    function startGame(){
        //if(roomUsers.length !== 4){
        //    console.log("WAIT OTHER PEOPLE");
        //}else{
        //     ipcRenderer.send("start_game_fb", props.room.roomName);
        //}
        ipcRenderer.send("start_game_fb", props.room.roomName);
    }

    useEffect(()=>{
        function update_room_users_listener(event, args){
            console.log(args);
            console.log(roomUsers);
            setRoomUsers(args);
        }
        console.log(roomUsers);

        ipcRenderer.on("update_room_users_bf", update_room_users_listener);
        return ()=>{
            ipcRenderer.removeListener("update_room_users_bf", update_room_users_listener);
        };
    }, []);
    return (
        <div className="roomLobbyPage">
            <Header setPage={props.setPage} prevPageName="roomOptionPage" prevPageTitle="Room Option Page"/>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", height: "80vh", marginTop: "100px"}}>
                <Chat/>
                <div style={{width:"50vw", display: "grid", gridTemplateColumns: "1fr"}}>
                    <PlayerList users={roomUsers}/>
                    <CharacterList setSelectedCharId={setSelectedCharId}/>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}><Button disabled={roomLeader != currentUser} onClick={()=>{startGame()}} style={{width: 200, height: 75}}>Start Game</Button></div>
                </div>
            </div>
        </div>
    );
}

export default RoomLobbyPage;
