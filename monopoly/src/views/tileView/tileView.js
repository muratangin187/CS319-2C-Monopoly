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
        this.size = Globals.sizeOfBoard/11;
        if (Math.floor(this.id/ 10) === 0){
            this.x = Globals.sizeOfBoard-(this.id%10)*Globals.sizeOfBoard/11 - Globals.sizeOfBoard/11;
            this.y = Globals.sizeOfBoard- Globals.sizeOfBoard/11;
        }
        else if (Math.floor(this.id/ 10) === 1){
            this.x = 0;
            this.y = (Globals.sizeOfBoard- Globals.sizeOfBoard/11)-(this.id%10)*Globals.sizeOfBoard/11;
        }
        else if (Math.floor(this.id/ 10) === 2){
            this.x = 0 + (this.id%10)*Globals.sizeOfBoard/11;
            this.y = 0;
        }
        else if (Math.floor(this.id/ 10) === 3){
            this.x = Globals.sizeOfBoard- Globals.sizeOfBoard/11;
            this.y = 0 + (this.id%10)*Globals.sizeOfBoard/11;
        }
        this.border.beginFill(0xCEE5D1);
        this.border.lineStyle(1, 0x333333);
        //this.border.lineStyle(4, 0x000000);
        this.border.drawRect(this.x, this.y, this.size, this.size);
    }


}

export default tileView;