import React, {useEffect} from "react";
import Header from "../common/Header";
import PlayerList from "./components/PlayerList"
import Chat from "./components/Chat"
const {ipcRenderer} = require('electron');


function RoomLobbyPage(props) {
    const [roomUsers, setRoomUsers] = React.useState(props.room.roomUsers);

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
            <div style={{display: "flex", height: "80vh", marginTop: "100px"}}>
                <div style={{width: "50vw"}}><Chat/></div>
                <div style={{width:"50vw", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <PlayerList users={roomUsers}/>
                    <PlayerList />
                </div>
            </div>
        </div>
    );
}

export default RoomLobbyPage;
