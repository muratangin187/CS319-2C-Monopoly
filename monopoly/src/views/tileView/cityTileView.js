import * as PIXI from 'pixi.js'
import tileView from "./tileView";

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

class cityTileView extends tileView{
    constructor(city, id) {
        super(id);
        this.city = city;
        if(!this.city){
            this.city = new City("Ankara", "50$", ["$200", "$600", "$1400", "$1700", "$2000"], "$200", "$200", "$200", "0x0271BC", 0);
        }
        this.content = new PIXI.Container();
        this.content.name = "content";
        this.title = new PIXI.Container();
        this.title.name = "title";
        this.tile.addChild(this.title);
        this.tile.addChild(this.content);
        this.initializeDrawings()
    }
    initializeDrawings() {
        super.initializeDrawings();

        let titleBackground = new PIXI.Graphics();
        titleBackground.name = "titleBackground";
        titleBackground.beginFill(this.city.color);
        titleBackground.lineStyle(1, 0x333333);
        titleBackground.drawRect(this.x, this.y, this.size, this.size/4);
        this.title.addChild(titleBackground);

        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
        });
        let titleText =new PIXI.Text(this.city.name, {...style, align: "center", fontSize: 13});
        titleText.name = "titleText";
        titleText.anchor.x =0.5;
        titleText.anchor.y =0.5;
        titleText.x = titleBackground.getBounds().x + titleBackground.getBounds().width / 2;
        titleText.y = titleBackground.getBounds().y + titleBackground.getBounds().height + 10;
        this.title.addChild(titleText);

        let rentText = new PIXI.Text("Rent " + this.city.rent, {...style, align: "center", fontSize: 10});

        rentText.anchor.x =0.5;
        rentText.anchor.y =0.5;
        rentText.x = this.border.getBounds().x + this.border.getBounds().width / 2;

        rentText.y =this.y + this.size/(1.3);


        this.content.addChild(rentText);

    }
}
export default cityTileView;