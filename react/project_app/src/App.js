import React, {useState} from "react";
import MainPage from "./pages/main_page/MainPage";
import OptionPage from "./pages/option_page/OptionPage";
import CreateRoomPage from "./pages/create_room_page/CreateRoomPage";

function AppDemo() {
  const [page, setPage] = useState("mainPage");

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

    case "createRoomPage":
        return (
            <div className="App">
                <CreateRoomPage setPage={setPage}/>
            </div>
        );

    default:
      return (<div className="App">Default Empty Page</div>);
  }
}

export default App;
