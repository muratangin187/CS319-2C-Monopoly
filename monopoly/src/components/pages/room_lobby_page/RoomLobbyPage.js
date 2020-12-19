import React, {useEffect} from "react";
import Header from "../common/Header";
import PlayerList from "./components/PlayerList"
import Chat from "./components/Chat"
import CharacterList from "./components/CharacterList";
import {Button} from "@blueprintjs/core";
import {setIn} from "formik";
const {ipcRenderer} = require('electron');


function RoomLobbyPage(props) {
    const [roomUsers, setRoomUsers] = React.useState(props.room.roomUsers);
    const [selectedCharId, setSelectedCharId] = React.useState(-1);
    const [selectedCharName, setSelectedCharName] = React.useState("placeholder");
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

    function setCharacters(){
        ipcRenderer.send('set_character_fb', {roomName: props.room.roomName, currentUser: currentUser, selectedCharId: selectedCharId});
    }

    useEffect(()=>{
        function update_room_users_listener(event, args){
            console.log(args);
            console.log(roomUsers);
            setRoomUsers(args);
        }
        console.log(roomUsers);

        function setCharacterListener(event, msgObj){
            console.log("SET CHARACTER MSG");
            console.log(msgObj);
        }

        ipcRenderer.on("update_room_users_bf", update_room_users_listener);
        ipcRenderer.on('set_character_bf', setCharacterListener);
        return ()=>{
            ipcRenderer.removeListener("update_room_users_bf", update_room_users_listener);
        };
    }, []);
    return (
        <div className="roomLobbyPage">
            <Header setPage={props.setPage} prevPageName="roomOptionPage" prevPageTitle="Room Option Page"/>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", height: "80vh", marginTop: "100px"}}>
                <Chat users={roomUsers}/>
                <div style={{width:"50vw", display: "grid", gridTemplateColumns: "1fr"}}>
                    <PlayerList users={roomUsers} selectedCharId={selectedCharId} selectedCharName={selectedCharName} currentUser={currentUser}/>
                    <CharacterList setSelectedCharId={setSelectedCharId} setSelectedCharName={setSelectedCharName}/>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Button onClick={()=>{setCharacters()}} style={{width: 200, height: 75, margin: 8}}>Set character as selected</Button>
                        <Button disabled={roomLeader != currentUser} onClick={()=>{startGame()}} style={{width: 200, height: 75, margin: 8}}>Start Game</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomLobbyPage;
