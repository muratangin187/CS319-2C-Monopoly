import React from "react";
import './App.css';
import RoomList from "./components/RoomList";

const rows = [
  {
    name: "Room - 1",
    players: "1/4",
    passRequired: "No",
    boardTemplate: "Template - 1",
  },
  {
    name: "Room - 2",
    players: "3/4",
    passRequired: "Yes",
    boardTemplate: "Template - 2",
  },
  {
    name: "Room - 3",
    players: "1/4",
    passRequired: "No",
    boardTemplate: "Template - 2",
  },
  {
    name: "Room - 4",
    players: "4/4",
    passRequired: "No",
    boardTemplate: "Template - 1",
  }
];

function AppDemo() {
  return (
    <div className="App" style={{display: "flex", height: "100vh", width: "100vw"}}>
      <RoomList rows = {rows} />
    </div>
  );
}

export default App;
