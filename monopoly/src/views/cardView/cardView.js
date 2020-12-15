import * as PIXI from 'pixi.js'
import Globals from "../../globals"
class CardView{

    constructor() {
        this.card = new PIXI.Container();
        this.card.name = "card";
        this.border = new PIXI.Graphics();
        this.border.name = "border";
        this.card.addChild(this.border);
        Globals.app.stage.addChild(this.card);
    }

    initializeDrawings(){
        this.border.beginFill(0xFFFFFF);
        this.border.lineStyle(5, 0x333333);
        this.border.drawRect(0, 0, 250, 350);
    }

}

export default CardView;