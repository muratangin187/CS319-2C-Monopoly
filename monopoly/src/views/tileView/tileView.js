import * as PIXI from 'pixi.js'
import Globals from "../../globals"
class tileView{

    constructor(id) {
        this.id = id
        this.tile = new PIXI.Container();
        this.tile.name = "tile";
        this.border = new PIXI.Graphics();
        this.border.name = "border";
        this.tile.addChild(this.border);
        Globals.app.stage.addChild(this.tile);
    }

    initializeDrawings(){
        console.log(this.id/10);
        if (Math.floor(this.id/ 10) === 0){
            console.log("GIRDI");
            this.border.beginFill(0xFFFFFF);
            this.border.lineStyle(5, 0x333333);
            this.border.drawRect(Globals.sizeOfBoard-(this.id%10)*Globals.sizeOfBoard/11 - Globals.sizeOfBoard/11, Globals.sizeOfBoard- Globals.sizeOfBoard/11, Globals.sizeOfBoard/11, Globals.sizeOfBoard/11);
        }
        if (Math.floor(this.id/ 10) === 1){
            this.border.beginFill(0xFFFFFF);
            this.border.lineStyle(5, 0x333333);
            this.border.drawRect(0 , (Globals.sizeOfBoard- Globals.sizeOfBoard/11)-(this.id%10)*Globals.sizeOfBoard/11, Globals.sizeOfBoard/11, Globals.sizeOfBoard/11);
        }
        if (Math.floor(this.id/ 10) === 2){
            this.border.beginFill(0xFFFFFF);
            this.border.lineStyle(5, 0x333333);
            this.border.drawRect(0 + (this.id%10)*Globals.sizeOfBoard/11, 0, Globals.sizeOfBoard/11, Globals.sizeOfBoard/11);
        }
        if (Math.floor(this.id/ 10) === 3){
            this.border.beginFill(0xFFFFFF);
            this.border.lineStyle(5, 0x333333);
            this.border.drawRect(Globals.sizeOfBoard- Globals.sizeOfBoard/11, 0 + (this.id%10)*Globals.sizeOfBoard/11, Globals.sizeOfBoard/11, Globals.sizeOfBoard/11);
        }

    }

}

export default tileView;