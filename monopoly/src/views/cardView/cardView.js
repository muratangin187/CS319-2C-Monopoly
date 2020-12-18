import * as PIXI from 'pixi.js'
import Globals from "../../globals"

class CardView{

    constructor(id) {
        this.id = id;
        this.card = new PIXI.Container();
        this.card.name = "card";
        this.border = new PIXI.Graphics();
        this.border.name = "border";
        this.card.addChild(this.border);
        Globals.app.stage.addChild(this.card);
    }

    initializeDrawings(){
        this.border.beginFill(0xFFFFFF); //0xCEE5D1
        this.border.lineStyle(2, 0x333333);
        this.border.drawRect(0, 0, 150, 200);
        this.border.position.set(0,Globals.sizeOfBoard - 400);
        this.border.alpha = 0.9;

        this.card.interactive = true;

    }

    setCallBack(funcIn, funcOut){
        this.funcIn = funcIn;
        this.funcOut = funcOut;
        this.card.on("mouseover",() =>{
            this.funcIn(this.id);
        });
        this.card.on("mouseout",() =>{
            this.funcOut(this.id);
        });
    }



}

export default CardView;