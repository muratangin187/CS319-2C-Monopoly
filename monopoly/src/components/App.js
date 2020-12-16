import React from 'react'
import * as PIXI from 'pixi.js'
import socketIOClient from "socket.io-client";
import CityCardView from "../views/cardView/cityCardView"
import SpecialCardView from "../views/cardView/specialCardView"
import Globals from "../globals"

import '../assets/css/App.css'
import railroad from "../views/assets/railroad.png";
import electric from "../views/assets/electric.png";
import water from "../views/assets/water.png";
import StationCardView from "../views/cardView/stationCardView";
import UtilityCardView from "../views/cardView/utilityCardView";
import tileView from "../views/tileView/tileView";
import cardView from "../views/cardView/cardView";

function initPixi(){
  PIXI.settings.RESOLUTION = 2;
  Globals.app = new PIXI.Application({resizeTo: window});
  Globals.app.view.style.width = "100%";
  Globals.app.view.style.height = "100%";
  document.getElementById("canvas").appendChild(Globals.app.view);
  const loader = Globals.app.loader.add("electric", electric).add("water", water).add("railroad", railroad).load((loader, resources)=>{
    Globals.resources = resources;
    let test = new CityCardView();
    let test2 = new SpecialCardView({title: "Quest Card #2", type: 0, info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultrices, elit semper auctor luctus, neque quam tempor lacus, faucibus egestas metus nunc nec elit. Donec ut est erat. Nunc tincidunt magna eget mi vehicula, nec aliquam justo ultrices. In ac bibendum libero."});
    test2.card.x = 260;
    let test3 = new StationCardView();
    test3.card.x = 390;
    let test4 = new UtilityCardView();
    test4.card.x = 520;
    for(let i = 0; i < 40; i++){
      let testBoard = new tileView(i);
      testBoard.initializeDrawings();
    }


  });
}

function testSocketIO(){
  const socket = socketIOClient(endPoint);
  socket.on("test", data2 => {
    console.log(data2);
    setData(data2);
  });
}

function App() {
  const [endPoint, setEndPoint] = React.useState("http://localhost:3000");
  const [data, setData] = React.useState("");

  React.useEffect(() => {
    initPixi();
  }, []);


    return (
        <div>
          <div id="canvas"/>
        </div>
  )
}

export default App
