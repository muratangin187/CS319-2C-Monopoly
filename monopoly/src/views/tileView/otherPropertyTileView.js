import * as PIXI from 'pixi.js'
import tileView from "./tileView";
import Globals from "../../globals"

class propertyTileView extends tileView{
    constructor(property) {
        super(property.tile);
        this.property = property;
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

        let icon = new PIXI.Sprite(this.property.image);
        icon.width = 35;
        icon.height = 35;
        icon.x = this.x + this.size / 2 - 17.5;
        icon.y = this.y + this.size / 4;

        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
        });
        let formattedTitle = this.property.name;
        formattedTitle = formattedTitle.split(" ").join("\n");
        let titleText =new PIXI.Text(formattedTitle, {...style, align: "center", fontSize: 9});
        titleText.name = "titleText";
        titleText.anchor.x =0.5;
        titleText.anchor.y =0.5;
        titleText.x = this.x + this.size / 2;
        titleText.y = this.y + 12;
        this.title.addChild(titleText);

        let rentText = new PIXI.Text("Price " + this.property.price, {...style, align: "center", fontSize: 10});

        rentText.anchor.x =0.5;
        rentText.anchor.y =0.5;
        rentText.x = this.border.getBounds().x + this.border.getBounds().width / 2;

        rentText.y =this.y + this.size/(1.1);


        this.content.addChild(rentText);

        this.tile.addChild(icon);
    }
}
export default propertyTileView;
