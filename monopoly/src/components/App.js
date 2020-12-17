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
import {util} from "webpack";

function initPixi(){
  PIXI.settings.RESOLUTION = 2;
  Globals.app = new PIXI.Application({resizeTo: window});
  Globals.app.view.style.width = "100%";
  Globals.app.view.style.height = "100%";
  document.getElementById("canvas").appendChild(Globals.app.view);
  const loader = Globals.app.loader.add("board_center", board_center).add("income_tax", income_tax).add("community", community).add("chance", chance).add("luxury", luxury).add("free_parking", free_parking).add("visit_jail", visit_jail).add("goto_jail", goto_jail).add("start_tile", start_tile).add("electric", electric).add("water", water).add("railroad", railroad).load((loader, resources)=>{
    Globals.resources = resources;

    let browns = new CityGroupModel([], "0x382b1c");
    let lightBlues = new CityGroupModel([], "0x3cb8de");
    let pinks = new CityGroupModel([], "0xde3cd3");
    let oranges = new CityGroupModel([], "0xde883c");
    let reds = new CityGroupModel([], "0xD40B0A");
    let yellows = new CityGroupModel([], "0xFFC90F");
    let greens = new CityGroupModel([], "0x24733B");
    let blues = new CityGroupModel([], "0x0541CA");


    let tiles = Globals.tiles;
    let image = Globals.resources.start_tile.texture
    for(let i = 0; i < 40; i++){
      let type = tiles[i]["type"];
      // console.log("type" + type);
      if (type === "CornerTile") {
        let image = tiles[i]["image"];
        let tile = tiles[i]["tile"];
        let cornerTile = new CornerTileView(image, tile);
        cornerTile.initializeDrawings();
      }
      else if (type === "StationTile") {
        let name = tiles[i]["name"];
        let rentPrice = tiles[i]["rentPrice"];
        let mortgagePrice = tiles[i]["mortgagePrice"];
        let price = tiles[i]["price"];
        let tile = tiles[i]["tile"];
        let image = tiles[i]["image"];
        let station = new StationModel(5, name,  rentPrice, mortgagePrice, price, tile, tile, null, false, image);
        let stationTile = new otherPropertyTileView(station);
        stationTile.initializeDrawings();
      }
      else if (type === "CityTile") {
        let id = tiles[i]["id"]
        let name = tiles[i]["name"];
        let rentPrice = tiles[i]["rentPrice"];
        let mortgagePrice = tiles[i]["mortgagePrice"];
        let price = tiles[i]["price"];
        let tile = tiles[i]["tile"];
        let houseCost = tiles[i]["houseCost"];
        let hotelCost = tiles[i]["hotelCost"];
        let color = tiles[i]["cityColor"];
        let cityGroup = new CityGroupModel([], 0xFFFFFF);
        if (color === browns.color) {
          cityGroup = browns;
        }
        if (color === lightBlues.color) {
          cityGroup = lightBlues;
        }
        if (color === pinks.color) {
          cityGroup = pinks;
        }
        if (color === oranges.color) {
          cityGroup = oranges;
        }
        if (color === reds.color) {
          cityGroup = reds;
        }
        if (color === yellows.color) {
          cityGroup = yellows;
        }
        if (color === greens.color) {
          cityGroup = greens;
        }
        if (color === blues.color) {
          cityGroup = blues;
        }
        let city = new CityModel(id, name,  rentPrice, mortgagePrice, price, tile, null, houseCost, hotelCost, null, cityGroup);
        cityGroup.cities.push(city);
        let cityTile = new cityTileView(city);
        cityTile.initializeDrawings();
      }
      else if (type === "SpecialTile") {
        let name = tiles[i]["name"];
        let tile = tiles[i]["tile"];
        let image = tiles[i]["image"];
        let specialTile = new SpecialTileView(name ,image, tile);
        specialTile.initializeDrawings();
      }
      else if (type === "CornerTile") {
        let tile = tiles[i]["tile"];
        let image = tiles[i]["image"];
        let cornerTile = new CornerTileView(image, tile);
        cornerTile.initializeDrawings();
      }
      else if (type === "UtilityTile") {
        let name = tiles[i]["name"];
        let rentPrice = tiles[i]["rentPrice"];
        let mortgagePrice = tiles[i]["mortgagePrice"];
        let price = tiles[i]["price"];
        let tile = tiles[i]["tile"];
        let image = tiles[i]["image"];
        let utility = new UtilityModel(tile, name,  rentPrice, mortgagePrice, price, tile, null, false, image);
        let utilityTile = new otherPropertyTileView(utility);
        utilityTile.initializeDrawings();
      }
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
