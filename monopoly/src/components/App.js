import React from 'react'
import * as PIXI from 'pixi.js'
import Globals from "../globals"
import socketIOClient from "socket.io-client";

import CityModel from "../models/cityModel";
import CityGroupModel from "../models/cityGroupModel";
import UtilityModel from "../models/utilityModel";

import CityCardView from "../views/cardView/cityCardView"
import SpecialCardView from "../views/cardView/specialCardView"
import StationCardView from "../views/cardView/stationCardView";
import UtilityCardView from "../views/cardView/utilityCardView";

import '../assets/css/App.css'
import railroad from "../views/assets/railroad.png";
import electric from "../views/assets/electric.png";
import water from "../views/assets/water.png";
import start_tile from "../views/assets/start_tile.png";
import visit_jail from "../views/assets/visit_jail.png";
import free_parking from "../views/assets/free_parking.png";
import goto_jail from "../views/assets/goto_jail.png";
import income_tax from "../views/assets/income_tax.png";
import luxury from "../views/assets/luxury.png";
import chance from "../views/assets/chance.png";
import community from "../views/assets/community.png";
import board_center from "../views/assets/board_center.png";


import tileView from "../views/tileView/tileView";
import cardView from "../views/cardView/cardView";
import cityTileView from "../views/tileView/cityTileView";
import otherPropertyTileView from "../views/tileView/otherPropertyTileView";
import CornerTileView from "../views/tileView/cornerTileView";
import SpecialTileView from "../views/tileView/specialTileView";
import StationModel from "../models/stationModel";

function initPixi(){
  PIXI.settings.RESOLUTION = 2;
  Globals.app = new PIXI.Application({resizeTo: window});
  Globals.app.view.style.width = "100%";
  Globals.app.view.style.height = "100%";
  document.getElementById("canvas").appendChild(Globals.app.view);
  const loader = Globals.app.loader.add("board_center", board_center).add("income_tax", income_tax).add("community", community).add("chance", chance).add("luxury", luxury).add("free_parking", free_parking).add("visit_jail", visit_jail).add("goto_jail", goto_jail).add("start_tile", start_tile).add("electric", electric).add("water", water).add("railroad", railroad).load((loader, resources)=>{
    Globals.resources = resources;
    let cityGroup = new CityGroupModel([], "0x0271BC");
    let cityGroup2 = new CityGroupModel([], "0xF29626");
    let city1 = new CityModel(1, "Ankara",  ["$50" , "$200", "$600", "$1400", "$1700", "$2000"], "$200", "$400", 16,1, "$100", "$100", [], cityGroup);
    let city2 = new CityModel(2, "Istanbul",  ["$50" , "$200", "$600", "$1400", "$1700", "$2000"], "$200", "$400", 18,2, "$100", "$100", [], cityGroup);
    let city3 = new CityModel(3, "Izmir",  ["$50" , "$200", "$600", "$1400", "$1700", "$2000"], "$200", "$400", 19,3, "$100", "$100", [], cityGroup);
    let city4 = new CityModel(4, "Van",  ["$50" , "$200", "$600", "$1400", "$1700", "$2000"], "$200", "$400", 37,4, "$100", "$100", [], cityGroup2);
    let city5 = new CityModel(5, "Karaman",  ["$50" , "$200", "$600", "$1400", "$1700", "$2000"], "$200", "$400", 39,5, "$100", "$100", [], cityGroup2);
    let utility1 = new UtilityModel(6, "Electric service",  ["$50" , "$200", "$600", "$1400", "$1700", "$2000"], "$200", "$400", 12, 5, false, Globals.resources.electric.texture);
    let utility2 = new UtilityModel(7, "Water pump",  ["$50" , "$200", "$600", "$1400", "$1700", "$2000"], "$200", "$400", 28, 5, false, Globals.resources.water.texture);
    let station1 = new StationModel(5, "Railroad",  ["$50" , "$200", "$600", "$1400", "$1700", "$2000"], "$200", "$400", 17, 5, false, Globals.resources.railroad.texture);
    cityGroup.cities.push(city1);
    cityGroup.cities.push(city2);
    cityGroup.cities.push(city3);
    cityGroup2.cities.push(city4);
    cityGroup2.cities.push(city5);
    let testBoard1 = new cityTileView(city1);
    testBoard1.initializeDrawings();
    let testBoard2 = new cityTileView(city2);
    testBoard2.initializeDrawings();
    let testBoard3 = new cityTileView(city3);
    testBoard3.initializeDrawings();
    let testBoard4 = new cityTileView(city4);
    testBoard4.initializeDrawings();
    let testBoard5 = new cityTileView(city5);
    testBoard5.initializeDrawings();
    let testBoard6 = new otherPropertyTileView(utility1);
    testBoard6.initializeDrawings();
    let testBoard7 = new otherPropertyTileView(utility2);
    testBoard7.initializeDrawings();
    let testBoard8 = new CornerTileView(Globals.resources.start_tile.texture, 0);
    testBoard8.initializeDrawings();
    let testBoard9 = new CornerTileView(Globals.resources.visit_jail.texture, 10);
    testBoard9.initializeDrawings();
    let testBoard10 = new CornerTileView(Globals.resources.free_parking.texture, 20);
    testBoard10.initializeDrawings();
    let testBoard11 = new CornerTileView(Globals.resources.goto_jail.texture, 30);
    testBoard11.initializeDrawings();
    let testBoard12 = new SpecialTileView("Luxury Tax",Globals.resources.luxury.texture, 38);
    testBoard12.initializeDrawings();
    let testBoard13 = new SpecialTileView("Income Tax",Globals.resources.income_tax.texture, 4);
    testBoard13.initializeDrawings();
    let testBoard14 = new SpecialTileView("Chance",Globals.resources.chance.texture, 7);
    testBoard14.initializeDrawings();
    let testBoard15 = new SpecialTileView("Community",Globals.resources.community.texture, 2);
    testBoard15.initializeDrawings();
    let testBoard16 = new SpecialTileView("Community",Globals.resources.community.texture, 17);
    testBoard16.initializeDrawings();
    let testBoard17 = new SpecialTileView("Chance",Globals.resources.chance.texture, 22);
    testBoard17.initializeDrawings();
    let testBoard18 = new SpecialTileView("Community",Globals.resources.community.texture, 33);
    testBoard18.initializeDrawings();
    let testBoard19 = new SpecialTileView("Chance",Globals.resources.chance.texture, 36);
    testBoard19.initializeDrawings();
    let boardCenter = new PIXI.Sprite(Globals.resources.board_center.texture);
    boardCenter.x = Globals.sizeOfBoard / 11;
    boardCenter.y = Globals.sizeOfBoard / 11;
    boardCenter.width = Globals.sizeOfBoard / 11 * 9;
    boardCenter.height = Globals.sizeOfBoard / 11 * 9;
    Globals.app.stage.addChild(boardCenter);
    let test = new CityCardView(city4);
    let test2 = new SpecialCardView({title: "Quest Card #2", type: 0, info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultrices, elit semper auctor luctus, neque quam tempor lacus, faucibus egestas metus nunc nec elit. Donec ut est erat. Nunc tincidunt magna eget mi vehicula, nec aliquam justo ultrices. In ac bibendum libero."});
    test2.card.x = 260;
    let test3 = new StationCardView(station1);
    test3.card.x = 520;
    let test4 = new UtilityCardView(utility1);
    test4.card.x = 780;
    //for(let i = 6; i < 40; i++){
    //  let testBoard = new cityTileView(city6);
    //  testBoard.initializeDrawings();
    //}


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
