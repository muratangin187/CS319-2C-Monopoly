import CardView from "./cardView";
import * as PIXI from 'pixi.js';


class UtilityCardView extends CardView{
    constructor(utility) {
        super(utility.id);
        this.utility = utility;
        this.content = new PIXI.Container();
        this.content.name = "content";
        this.title = new PIXI.Container();
        this.title.name = "title";
        this.card.addChild(this.title);
        this.card.addChild(this.content);
        this.initializeDrawings();
    }

    initializeDrawings() {
        super.initializeDrawings();

        let titleBackground = new PIXI.Graphics();
        titleBackground.name = "titleBackground";
        titleBackground.beginFill(0xf0f7f1);
        titleBackground.lineStyle(2, 0x333333);
        console.log(this.border);
        titleBackground.drawRect(this.border.x, this.border.y, this.border.width-2, this.border.height/5);
        titleBackground.alpha = 0.9;
        this.title.addChild(titleBackground);

        let icon = new PIXI.Sprite(this.utility.image);
        icon.width = 70;
        icon.height = 70;
        icon.x = this.border.width / 2 - 35;
        icon.y = titleBackground.y + 30;
        this.card.addChild(icon);

        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
        });
        let titleText =new PIXI.Text(this.utility.name, style);
        titleText.name = "titleText";
        titleText.anchor.x =0.5;
        titleText.anchor.y =0.5;
        titleText.x = titleBackground.getBounds().x + titleBackground.getBounds().width / 2;
        titleText.y = titleBackground.getBounds().y + titleBackground.getBounds().height / 2;
        this.title.addChild(titleText);


        let propText = new PIXI.Text(`If ONE Utility is owned, 
rent is 4x the amount shown on
the dice when the opponent
rolled, but if BOTH
Utilities are owned, rent
is 10x the amount shown
on the dice`,{...style, fontSize: 16, align: "center"});
        let costText = new PIXI.Text(`Mortgage Value ${this.utility.mortgagePrice}`,{...style, align: "center", fontSize: 16});

        propText.anchor.x =0.6;
        propText.anchor.y =0.6;
        propText.x = this.border.x + this.border.width / 2 + 10;
        costText.anchor.x =0.5;
        costText.anchor.y =0.5;
        costText.x = this.border.x + this.border.width / 2;

        propText.y = this.border.y + this.border.height/4 + this.border.height/4;
        costText.y = propText.y + this.border.height/4;

        this.content.addChild(propText);
        this.content.addChild(costText);
    }
}

export default UtilityCardView;