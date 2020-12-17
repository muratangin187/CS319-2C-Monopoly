import * as PIXI from 'pixi.js'
import tileView from "./tileView";

class cityTileView extends tileView{
    constructor(city) {
        super(city.tile);
        this.city = city;
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
        titleBackground.beginFill(this.city.cityGroup.color);
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

        let rentText = new PIXI.Text("Price " + this.city.price, {...style, align: "center", fontSize: 8});

        rentText.anchor.x =0.5;
        rentText.anchor.y =0.5;
        rentText.x = this.border.getBounds().x + this.border.getBounds().width / 2;

        rentText.y =this.y + this.size/(1.3);


        this.content.addChild(rentText);

    }
}
export default cityTileView;