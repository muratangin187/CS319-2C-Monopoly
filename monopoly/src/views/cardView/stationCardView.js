import CardView from "./cardView";
import * as PIXI from 'pixi.js';


class StationCardView extends CardView{
    constructor(station) {
        super(station.id);
        this.station = station;
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

        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
        });
        this.titleText =new PIXI.Text(this.station.name, {...style, fontSize: 12});
        this.titleText.name = "titleText";
        this.titleText.anchor.x =0.5;
        this.titleText.anchor.y =0.5;
        this.titleText.x = this.border.x + this.border.width / 2;
        this.titleText.y = titleBackground.y + titleBackground.height / 2;
        this.title.addChild(this.titleText);

        let propText = new PIXI.Text(`Rent ................................. ${this.station.rentPrice[0]}$
If 1 owned ....................... ${this.station.rentPrice[1]}$
If 2 owned ....................... ${this.station.rentPrice[2]}$
If 3 owned ....................... ${this.station.rentPrice[3]}$`,{...style, fontSize: 11});
        let costText = new PIXI.Text(`Mortgage Value ${this.station.mortgagePrice}`,{...style, align: "center", fontSize: 10});

        propText.anchor.x =0.5;
        propText.anchor.y =0.5;
        propText.x = this.border.getBounds().x + this.border.getBounds().width / 2;
        costText.anchor.x =0.5;
        costText.anchor.y =0.5;
        costText.x = this.border.getBounds().x + this.border.getBounds().width / 2;

        propText.y = this.border.y + this.border.height/2;
        costText.y = propText.y + this.border.height/4;

        this.content.addChild(propText);
        this.content.addChild(costText);
    }
}

export default StationCardView;
