import * as PIXI from 'pixi.js'
import Globals from "../../globals";
import cityTileView from "./cityTileView";
import {resolvePlugin} from "@babel/core/lib/config/files/index-browser";
class Character{
    constructor(image, tileId, id) {
        this.id = id;
        this.tileId = tileId;
        this.char = new PIXI.Container();
        this.image = new PIXI.Sprite(image);
        this.char.addChild(this.image);
        Globals.app.stage.addChild(this.char);
        this.size = Globals.sizeOfBoard/Globals.tileNumber;
        this.initializeDrawings()
        //this.move((Globals.tileNumber -1)0);

    }

    initializeDrawings() {


        if (Math.floor(this.tileId/ (Globals.tileNumber -1)) === 0){
            this.x = Globals.sizeOfBoard-(this.tileId%(Globals.tileNumber -1))*Globals.sizeOfBoard/Globals.tileNumber - Globals.sizeOfBoard/Globals.tileNumber;
            this.y = Globals.sizeOfBoard- Globals.sizeOfBoard/Globals.tileNumber;
        }
        else if (Math.floor(this.tileId/ (Globals.tileNumber -1)) === 1){
            this.x = 0;
            this.y = (Globals.sizeOfBoard- Globals.sizeOfBoard/Globals.tileNumber)-(this.tileId%(Globals.tileNumber -1))*Globals.sizeOfBoard/Globals.tileNumber;
        }
        else if (Math.floor(this.tileId/ (Globals.tileNumber -1)) === 2){
            this.x = 0 + (this.tileId%(Globals.tileNumber -1))*Globals.sizeOfBoard/Globals.tileNumber;
            this.y = 0;
        }
        else if (Math.floor(this.tileId/ (Globals.tileNumber -1)) === 3){

            this.x = Globals.sizeOfBoard- (Globals.sizeOfBoard/Globals.tileNumber);
            this.y = 0 + (this.tileId%(Globals.tileNumber -1))*(Globals.sizeOfBoard/Globals.tileNumber);
        }
        this.image.width =20;
        this.image.height = 30;
        this.image.x = this.x + this.size/4;
        this.image.y = this.y + this.size/4;

    }


    // returnTilePosition(newTileId) {
    //     let x;
    //     let y;
    //     if (Math.floor(newTileId / (Globals.tileNumber -1)) === 0) {
    //         x = Globals.sizeOfBoard - (newTileId % (Globals.tileNumber -1)) * Globals.sizeOfBoard / Globals.tileNumber - Globals.sizeOfBoard / Globals.tileNumber;
    //         y = Globals.sizeOfBoard - Globals.sizeOfBoard / Globals.tileNumber;
    //     } else if (Math.floor(newTileId / (Globals.tileNumber -1)) === 1) {
    //         x = 0;
    //         y = (Globals.sizeOfBoard - Globals.sizeOfBoard / Globals.tileNumber) - (newTileId % (Globals.tileNumber -1)) * Globals.sizeOfBoard / Globals.tileNumber;
    //     } else if (Math.floor(newTileId / (Globals.tileNumber -1)) === 2) {
    //         x = 0 + (newTileId % (Globals.tileNumber -1)) * Globals.sizeOfBoard / Globals.tileNumber;
    //         y = 0;
    //     } else if (Math.floor(newTileId / (Globals.tileNumber -1)) === 3) {
    //         x = Globals.sizeOfBoard - Globals.sizeOfBoard / Globals.tileNumber;
    //         y = 0 + (newTileId % (Globals.tileNumber -1)) * Globals.sizeOfBoard / Globals.tileNumber;
    //     }
    //     return { x : x , y : y };
    // }









    async move(newTileId){
        let x = newTileId - this.tileId;
        if(x < 0){
            x = x + (4*(Globals.tileNumber-1));
        }
        for(let i = 0; i< x; i++){

            await this.moveToNextTile(x);
            this.tileId = (this.tileId + 1)%((Globals.tileNumber-1)*4);
            console.log("this.tileId = " + this.tileId);
            console.log("i = " + i);

        }
        return;


    }
    moveToNextTile(weight){

            return new Promise((resolve, reject )=>{

                let counter = 0;
                let step = this.size/10;
                let timer = setInterval(()=> {
                    if(this.tileId %(Globals.tileNumber -1) === 0){ //Corner
                        if(Math.floor(this.tileId/(Globals.tileNumber-1)) === 0){
                            this.char.x = this.char.x -step;
                        }
                        else if(Math.floor(this.tileId/(Globals.tileNumber-1)) === 1){
                            this.char.y = this.char.y - step;
                        }
                        else if(Math.floor(this.tileId/(Globals.tileNumber-1)) === 2){
                            this.char.x = this.char.x + step;
                        }
                        else if(Math.floor(this.tileId/(Globals.tileNumber-1)) === 3){
                            this.char.y = this.char.y + step;
                        }
                    }
                    else{   //Not corner
                        if(this.tileId/(Globals.tileNumber -1) < 1){
                            this.char.x = this.char.x -step;
                        }
                        else if(this.tileId/(Globals.tileNumber -1) < 2){
                            this.char.y = this.char.y - step;
                        }
                        else if(this.tileId/(Globals.tileNumber -1) < 3){
                            this.char.x = this.char.x + step;
                        }
                        else if(this.tileId/(Globals.tileNumber -1) < 4){
                            this.char.y = this.char.y + step;
                        }
                    }
                    counter = counter + step;
                    console.log("y önce: " + this.char.y);
                    if(counter === this.size ){
                        //let pos =  this.returnTilePosition(this.tileId + 1);

                        //this.char.x = pos.x;
                        //this.char.y = pos.y;
                        console.log("y sonra: " + this.char.y);
                        clearInterval(timer);
                        resolve();
                    }
                }, 10);
            });


        }


}

export default Character;