import React, {useEffect, useState} from "react";
import MainPage from "./pages/main_page/MainPage";
import OptionPage from "./pages/option_page/OptionPage";
import CreateRoomPage from "./pages/create_room_page/CreateRoomPage";
import RoomOptionPage from "./pages/room_option_page/RoomOptionPage";
import SelectRoomPage from "./pages/select_room_page/SelectRoomPage";
const {ipcRenderer} = require('electron');

function App() {
  const [page, setPage] = useState("mainPage");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
      function get_room_listener(event, args){
          setRooms(args);
      };
      ipcRenderer.on("get_rooms_bf", get_room_listener);
      return function cleanup()
      {
          ipcRenderer.removeListener("get_room_bf", get_room_listener);
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
                <CreateRoomPage setPage={setPage} />
            </div>
        );

    case "selectRoomPage":
        return(
            <div className="App">
                <SelectRoomPage setPage={setPage} rooms={rooms}/>
            </div>
        );

    default:
      return (<div className="App">Default Empty Page</div>);
  }
}

export default App;
