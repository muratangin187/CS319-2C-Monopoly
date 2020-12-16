import CardView from "./cardView";
import * as PIXI from 'pixi.js';

class City{
    constructor(name, rent, price, mortgage, houseCost, hotelCost, color, id) {
        this.name = name;
        this.rent = rent;
        this.price = price;
        this.mortgage = mortgage;
        this.houseCost = houseCost;
        this.hotelCost = hotelCost;
        this.color = color;
        this.id = id;
    }
}

class CityCardView extends CardView{
    constructor(city) {
        super();
        this.city = city;
        if(!this.city){
            this.city = new City("Ankara", "50$", ["$200", "$600", "$1400", "$1700", "$2000"], "$200", "$200", "$200", "0x00A5FF", 0);
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

        let titleBackground = new PIXI.Graphics();
        titleBackground.name = "titleBackground";
        titleBackground.beginFill(this.city.color);
        titleBackground.lineStyle(5, 0x333333);
        titleBackground.drawRect(10, 10, 230, 50);
        this.title.addChild(titleBackground);

        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
        });
        let titleText =new PIXI.Text(this.city.name, style);
        titleText.name = "titleText";
        titleText.anchor.x =0.5;
        titleText.anchor.y =0.5;
        titleText.x = titleBackground.getBounds().x + titleBackground.getBounds().width / 2;
        titleText.y = titleBackground.getBounds().y + titleBackground.getBounds().height / 2;
        this.title.addChild(titleText);

        let rentText = new PIXI.Text("Rent " + this.city.rent, {...style, align: "center", fontSize: 18});
        let propText = new PIXI.Text(`With 1 House ....................... ${this.city.price[0]}
With 2 House ....................... ${this.city.price[1]}
With 3 House ....................... ${this.city.price[2]}
With 4 House ....................... ${this.city.price[3]}
With Hotel ........................... ${this.city.price[4]}`,{...style, fontSize: 16});
        let costText = new PIXI.Text(`Mortgage Value ${this.city.mortgage}
Houses cost ${this.city.houseCost}. each
Hotels, ${this.city.hotelCost}. plus 4 houses`,{...style, align: "center", fontSize: 16});
        let infoText = new PIXI.Text(`If a player owns ALL the Lots of any
Color-Group, the rent is Doubled on
Unimproved Lots in that group.`,{...style, align: "center", fontSize: 10});

        rentText.anchor.x =0.5;
        rentText.anchor.y =0.5;
        rentText.x = this.border.getBounds().x + this.border.getBounds().width / 2;
        propText.anchor.x =0.5;
        propText.anchor.y =0.5;
        propText.x = this.border.getBounds().x + this.border.getBounds().width / 2;
        costText.anchor.x =0.5;
        costText.anchor.y =0.5;
        costText.x = this.border.getBounds().x + this.border.getBounds().width / 2;
        infoText.anchor.x =0.5;
        infoText.anchor.y =0.5;
        infoText.x = this.border.getBounds().x + this.border.getBounds().width / 2;

        rentText.y = 80;
        propText.y = 150;
        costText.y = 250;
        infoText.y = 320;

        this.content.addChild(rentText);
        this.content.addChild(propText);
        this.content.addChild(costText);
        this.content.addChild(infoText);
    }
}

export default CityCardView;