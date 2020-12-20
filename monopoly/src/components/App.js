import React, {useEffect, useState} from "react";
const {ipcRenderer} = require('electron');
import MainPage from "./pages/main_page/MainPage";
import OptionPage from "./pages/option_page/OptionPage";
import CreateRoomPage from "./pages/create_room_page/CreateRoomPage";
import RoomOptionPage from "./pages/room_option_page/RoomOptionPage";
import SelectRoomPage from "./pages/select_room_page/SelectRoomPage";
import RoomLobbyPage from "./pages/room_lobby_page/RoomLobbyPage";
import GameScreen from "./pages/game_screen/GameScreen";
import CharacterList from "./pages/room_lobby_page/components/CharacterList";
import Chat from "./pages/room_lobby_page/components/Chat";
import BoardManager from "./boardManager";
import { AppToaster } from "./toaster";

function App() {
  const [page, setPage] = useState("mainPage");
  const [rooms, setRooms] = useState([]);
  const [gameRoom, setGameRoom] = useState({});
  const [selectedRoom, setSelectedRoom] = useState({});
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
      function get_room_listener(event, args){
          setRooms(args);
      };
      function change_page_listener(event, args){
          console.log(JSON.stringify(args, null, 2));
          setSelectedRoom({roomName: args.result.room, roomUsers: args.result.users});
          setCurrentUser(args.currentUser);
          setPage(args.result.page);
      };

      function start_game_listener(event, roomObject){
          //{room_name: "Test", password: "123", selectedBoard: "Template - 1", users: []}
          setGameRoom(roomObject);
          console.log(gameRoom);
          setPage("gameScreen");
      };

      function showNotificationListener(event, args){
          AppToaster.show(args);
      }

      ipcRenderer.on("get_rooms_bf", get_room_listener);
      ipcRenderer.on("change_page_bf", change_page_listener);
      ipcRenderer.on("start_game_bf", start_game_listener);
      ipcRenderer.on("show_notification", showNotificationListener);
      return function cleanup()
      {
          ipcRenderer.removeListener("get_room_bf", get_room_listener);
          ipcRenderer.removeListener("change_page_bf", change_page_listener);
          ipcRenderer.removeListener("start_game_bf", start_game_listener);
          ipcRenderer.removeListener("show_notification", showNotificationListener);
      };
  }, []);

  switch (page){
    case "mainPage":
      return(
        <div className="App">
          <MainPage setPage={setPage} />
        </div>
      );

    case "optionPage":
      return(
          <div className="App">
            <OptionPage setPage={setPage} />
          </div>
      );

    case "roomOptionPage":
        return (
            <div className="App">
                <RoomOptionPage setPage={setPage}/>
            </div>
        );

    case "createRoomPage":
        return (
            <div className="App">
                <CreateRoomPage setPage={setPage}/>
            </div>
        );

    case "selectRoomPage":
        return(
            <div className="App">
                <SelectRoomPage setPage={setPage} rooms={rooms}/>
            </div>
        );

      case "roomLobbyPage":
          return(
              <div className="App">
                  <RoomLobbyPage setPage={setPage} room={selectedRoom} currentUser={currentUser}/>
              </div>
          );

      case "gameScreen":
          return(
              <div className="App">
                  <GameScreen setPage={setPage} room={gameRoom} currentUser={currentUser}/>
              </div>
          );


    default:
      return (<div className="App">Default Empty Page</div>);
  }
}

export default App;
