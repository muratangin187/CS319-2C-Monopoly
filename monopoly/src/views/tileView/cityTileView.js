import * as PIXI from 'pixi.js'
import tileView from "./tileView";
import Globals from "../../globals";

class cityTileView extends tileView{
    constructor(city, callback) {
        super(city.tile);
        this.callback = callback;
        this.city = city;
        this.content = new PIXI.Container();
        this.content.name = "content";
        this.title = new PIXI.Container();
        this.title.name = "title";
        this.buildings = new PIXI.Container();
        this.buildings.name = "buildings";
        this.tile.addChild(this.title);
        this.tile.addChild(this.content);
        this.tile.addChild(this.buildings);
        this.callback = callback;

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
        let formattedTitle = this.city.name;
        formattedTitle = formattedTitle.split(" ").join("\n");
        let titleText =new PIXI.Text(formattedTitle, {...style, align: "center", fontSize: 9});
        titleText.name = "titleText";
        titleText.anchor.x =0.5;
        titleText.anchor.y =0.5;
        titleText.x = titleBackground.getBounds().x + titleBackground.getBounds().width / 2;
        titleText.y = titleBackground.getBounds().y + titleBackground.getBounds().height + 20;
        this.title.addChild(titleText);

        let rentText = new PIXI.Text("Price " + this.city.price + "$", {...style, align: "center", fontSize: 8});

        rentText.anchor.x =0.5;
        rentText.anchor.y =0.5;
        rentText.x = this.border.getBounds().x + this.border.getBounds().width / 2;

        rentText.y =this.y + this.size/(1.3);
        this.title.addChild(rentText);

        this.tile.on('mousedown', () => {
            this.callback(this.id);
            this.popUP = new PIXI.Graphics();
            this.tile.addChild(this.popUP);
            let offset = 50;
            // let popUpx;
            // let popUpy;
            this.tile.hitArea = new PIXI.Rectangle(this.x, this.y, this.size, this.size);

            // if (Math.floor(this.id / (Globals.tileNumber - 1)) === 0) {
            //     popUpx = this.x;
            //     popUpy = this.y - 3 * offset;
            // } else if (Math.floor(this.id / (Globals.tileNumber - 1)) === 1) {
            //     popUpx = offset * 2;
            //     popUpy = (Globals.sizeOfBoard - Globals.sizeOfBoard / Globals.tileNumber) - (this.id % (Globals.tileNumber - 1)) * Globals.sizeOfBoard / Globals.tileNumber - offset / 2;
            // } else if (Math.floor(this.id / (Globals.tileNumber - 1)) === 2) {
            //     popUpx = 0 + (this.id % (Globals.tileNumber - 1)) * Globals.sizeOfBoard / Globals.tileNumber;
            //     popUpy = offset * 2;
            // } else if (Math.floor(this.id / (Globals.tileNumber - 1)) === 3) {
            //     popUpx = Globals.sizeOfBoard - Globals.sizeOfBoard / Globals.tileNumber - 2 * offset;
            //     popUpy = 0 + (this.id % (Globals.tileNumber - 1)) * Globals.sizeOfBoard / Globals.tileNumber - offset / 2;
            // }

            this.popUP.beginFill(0xf0f7f1);
            this.popUP.lineStyle(3, 0x333333);
            this.popUP.drawRect(Globals.sizeOfBoard/2 - this.size , Globals.sizeOfBoard/2 - this.size - offset, 200, 300);
            this.popUP.alpha = 0.8;

            let titleBackground = new PIXI.Graphics();
            titleBackground.name = "titleBackground";
            titleBackground.beginFill(this.city.color);
            titleBackground.lineStyle(1, 0x333333);
            titleBackground.drawRect(Globals.sizeOfBoard/2 - this.size , Globals.sizeOfBoard/2 - this.size - offset, 200, 50);
            this.popUP.addChild(titleBackground);

            const style = new PIXI.TextStyle({
                fontFamily: "\"Times New Roman\", Times, serif", fontSize: 14, fontWeight: 3
            });
            let titleText =new PIXI.Text(this.city.name, style);
            titleText.name = "titleText";
            titleText.anchor.x =0.5;
            titleText.anchor.y =0.5;
            titleText.x = titleBackground.getBounds().x + titleBackground.getBounds().width / 2;
            titleText.y = titleBackground.getBounds().y + titleBackground.getBounds().height / 2;
            this.popUP.addChild(titleText);

            let rentText = new PIXI.Text("Rent " + this.city.rentPrice[0] + "$", {...style, align: "center", fontSize: 18});
            let propText = new PIXI.Text(`With 1 House ................ ${this.city.rentPrice[1]}$
With 2 House ................ ${this.city.rentPrice[2]}$
With 3 House ................ ${this.city.rentPrice[3]}$
With 4 House ................ ${this.city.rentPrice[4]}$
With Hotel .................... ${this.city.rentPrice[5]}$`,{...style, fontSize: 16});
//             let costText = new PIXI.Text(`Mortgage Value ${this.city.mortgagePrice}
// Houses cost ${this.city.houseCost}. each
// Hotels, ${this.city.hotelCost}. plus 4 houses`,{...style, align: "center", fontSize: 16});
//             let infoText = new PIXI.Text(`If a player owns ALL the Lots of any
// Color-Group, the rent is Doubled on
// Unimproved Lots in that group.`,{...style, align: "center", fontSize: 10});

            rentText.anchor.x =0.5;
            rentText.anchor.y =0.5;
            rentText.x = this.popUP.getBounds().x + this.popUP.getBounds().width / 2;
            propText.anchor.x =0.5;
            propText.anchor.y =0.5;
            propText.x = this.popUP.getBounds().x + this.popUP.getBounds().width / 2;
            // costText.anchor.x =0.5;
            // costText.anchor.y =0.5;
            // costText.x = this.popUP.getBounds().x + this.popUP.getBounds().width / 2;
            //infoText.anchor.x =0.5;
            //infoText.anchor.y =0.5;
            //infoText.x = this.popUP.getBounds().x + this.popUP.getBounds().width / 2;

            rentText.y = this.popUP.getBounds().y + this.popUP.height - 30;
            propText.y = Globals.sizeOfBoard/2 - this.size - offset + this.popUP.height/2.1; //- 120;
            //costText.y = this.popUP.getBounds().y + this.popUP.height - 60;
            //infoText.y = 320;

            this.popUP.addChild(rentText);
            this.popUP.addChild(propText);
            //this.popUP.addChild(costText);
            //this.popUP.addChild(infoText);

            console.log(this.y);
            console.log("sA");
        });
        this.tile.on('mouseup', () => {
            //this.popUP.destroy();
            this.tile.removeChild(this.popUP);
            console.log("siildim");
            this.popUP = null;
        });
        this.tile.on('mouseout', () => {
            if(this.popUP){
                //this.popUP.destroy();
                this.tile.removeChild(this.popUP);
                console.log("siildim");
                this.popUP = null;
            }

        });


        let houseCount = this.city.buildings.house;
        let hotelCount = this.city.buildings.hotel;

        this.buildings.children.forEach(child=>child.destroy());
        for (let i = 0; i < houseCount; i++) {
            console.log("House building " + i);
            let icon = new PIXI.Sprite(Globals.resources["house"].texture);
            icon.width = 20;
            icon.height = 20;
            icon.x = this.x + 20*i + 2.5;
            icon.y = this.y;
            this.buildings.addChild(icon);
        }
        for (let i = 0; i < hotelCount; i++) {
            console.log("Hotel building " + i);
            let icon = new PIXI.Sprite(Globals.resources["hotel"].texture);
            icon.width = 20;
            icon.height = 20;
            icon.x = this.x + this.size/2 - 10;
            icon.y = this.y;
            this.buildings.addChild(icon);
        }


    }
}
export default cityTileView;