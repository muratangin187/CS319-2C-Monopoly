import CardView from "./cardView";
import * as PIXI from 'pixi.js';
import Globals from "../../globals";

class CityCardView extends CardView{
    constructor(city) {
        super(city.id);
        this.city = city
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
        titleBackground.beginFill(this.city.color);
        titleBackground.lineStyle(2, 0x333333);
        console.log(this.border);
        titleBackground.drawRect(this.border.x, this.border.y, this.border.width-2, this.border.height/5);
        titleBackground.alpha = 0.9;
        this.title.addChild(titleBackground);

        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
            fontSize: 12
        });
        let formattedTitle = this.city.name;
        formattedTitle = formattedTitle.split(" ").join("\n");
        let titleText =new PIXI.Text(formattedTitle, {...style, align:"center"});
        titleText.name = "titleText";
        titleText.anchor.x =0.5;
        titleText.anchor.y =0.5;
        titleText.x = titleBackground.getBounds().x + titleBackground.getBounds().width / 2;
        titleText.y = titleBackground.getBounds().y + titleBackground.getBounds().height / 2;
        this.title.addChild(titleText);

        let rentText = new PIXI.Text("Price " + this.city.rentPrice[0] + "$", {...style, align: "center", fontSize: 14});
        let propText = new PIXI.Text(`With 1 House ............... ${this.city.rentPrice[1] + "$"}
With 2 House ............... ${this.city.rentPrice[2]+ "$"}
With 3 House ................${this.city.rentPrice[3]+ "$"}
With 4 House ............... ${this.city.rentPrice[4]+ "$"}
With Hotel ................... ${this.city.rentPrice[5]+ "$"}`,{...style, fontSize: 11});
        let costText = new PIXI.Text(`Mortgage Value ${this.city.mortgagePrice}
Houses cost ${this.city.houseCost}. each
Hotels, ${this.city.hotelCost}. plus 4 houses`,{...style, align: "center", fontSize:10});
//         let infoText = new PIXI.Text(`If a player owns ALL the Lots of any
// Color-Group, the rent is Doubled on
// Unimproved Lots in that group.`,{...style, align: "center", fontSize: 11});

        rentText.anchor.x =0.5;
        rentText.anchor.y =0.5;
        rentText.x = this.border.x + this.border.width / 2 ;
        propText.anchor.x =0.6;
        propText.anchor.y =0.6;
        propText.x = this.border.x + this.border.width / 2 + 10;
        costText.anchor.x =0.5;
        costText.anchor.y =0.5;
        costText.x = this.border.x + this.border.width / 2;
        // infoText.anchor.x =0.5;
        // infoText.anchor.y =0.5;
        // infoText.x = this.border.x + this.border.width / 2;

        rentText.y = this.border.y + this.border.height/4;
        propText.y = rentText.y + this.border.height/4;
        costText.y = propText.y + this.border.height/4;
        // infoText.y = 100000//costText.y + this.border.height/7;

        this.content.addChild(rentText);
        this.content.addChild(propText);
        this.content.addChild(costText);
        //this.content.addChild(infoText);
    }
}

export default CityCardView;