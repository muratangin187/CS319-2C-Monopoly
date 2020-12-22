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
        Globals.appHand.stage.addChild(this.card);
    }

    initializeDrawings(){
        this.border.beginFill(0xf0f7f1); //0xCEE5D1
        this.border.lineStyle(2, 0x333333);
        this.border.drawRect(0, 32, 150, 170);
        this.border.position.set(0,0);
        this.border.alpha = 0.95;

        this.card.interactive = true;

    }

    setCallBack(funcIn, funcOut, funcDown){
        this.funcIn = funcIn;
        this.funcOut = funcOut;
        this.funcDown = funcDown;
        this.card.on("mouseover",() =>{
            this.funcIn(this.id);
        });
        this.card.on("mouseout",() =>{
            this.funcOut(this.id);
        });
        this.card.on("mousedown",() =>{
            this.funcDown(this);
        });
    }



}

export default CardView;