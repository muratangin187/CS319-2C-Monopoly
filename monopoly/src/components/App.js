import React, {useEffect, useState} from "react";
import MainPage from "./pages/main_page/MainPage";
import OptionPage from "./pages/option_page/OptionPage";
import CreateRoomPage from "./pages/create_room_page/CreateRoomPage";
import RoomOptionPage from "./pages/room_option_page/RoomOptionPage";
import SelectRoomPage from "./pages/select_room_page/SelectRoomPage";
const {ipcRenderer} = require('electron');

function App() {
  const [page, setPage] = useState("mainPage");
  // const [rooms, setRooms] = useState([]);

    // useEffect(() => {
    //     function listener(event, args){
    //         setRooms(args);
    //         console.log("Reply");
    //         console.log(args);
    //     }
    //     ipcRenderer.on("create_room_reply", listener);
    //     ipcRenderer.send("get_rooms");
    //     return function cleanup()
    //     {
    //         ipcRenderer.removeListener("create_room_reply", listener);
    //     };
    // });

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
                <SelectRoomPage setPage={setPage}/>
            </div>
        );

    default:
      return (<div className="App">Default Empty Page</div>);
  }
}

export default App;
