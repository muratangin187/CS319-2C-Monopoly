import CardView from "./cardView";
import * as PIXI from 'pixi.js';
import Globals from "../../globals";

class Station{
    constructor(name, rent, price, mortgage, houseCost, hotelCost, color) {
        this.name = name;
        this.rent = rent;
        this.price = price;
        this.mortgage = mortgage;
        this.color = color;
    }
}

class StationCardView extends CardView{
    constructor(station) {
        super();
        this.station = station;
        if(!this.station){
            this.station = new Station("ATG", "$50", ["$200", "$600", "$1400"], "$200", "0xA500FF");
        }
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

        let icon = new PIXI.Sprite(Globals.resources.railroad.texture);
        icon.width = 70;
        icon.height = 70;
        icon.x = this.border.width / 2 - 35;
        icon.y = 10;
        this.card.addChild(icon);

        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
        });
        this.titleText =new PIXI.Text(this.station.name, style);
        this.titleText.name = "titleText";
        this.titleText.anchor.x =0.5;
        this.titleText.anchor.y =0.5;
        this.titleText.x = 10 + 115;
        this.titleText.y = 10 + 25 + 70;
        this.title.addChild(this.titleText);

        let propText = new PIXI.Text(`Rent ................................. ${this.station.rent}
If 1 owned ....................... ${this.station.price[0]}
If 2 owned ....................... ${this.station.price[1]}
If 3 owned ....................... ${this.station.price[2]}`,{...style, fontSize: 16});
        let costText = new PIXI.Text(`Mortgage Value ${this.station.mortgage}`,{...style, align: "center", fontSize: 16});

        propText.anchor.x =0.5;
        propText.anchor.y =0.5;
        propText.x = this.border.getBounds().x + this.border.getBounds().width / 2;
        costText.anchor.x =0.5;
        costText.anchor.y =0.5;
        costText.x = this.border.getBounds().x + this.border.getBounds().width / 2;

        propText.y = 200;
        costText.y = 300;

        this.content.addChild(propText);
        this.content.addChild(costText);
    }
}

export default StationCardView;
