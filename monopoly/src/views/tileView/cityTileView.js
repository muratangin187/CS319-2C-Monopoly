import * as PIXI from 'pixi.js'
import Globals from "../../globals"
class cityTileView{
    constructor(city) {
        this.city = city;
        if(!this.city){
            this.city = new City("Ankara", "50$", ["$200", "$600", "$1400", "$1700", "$2000"], "$200", "$200", "$200", "0x00A5FF");
        }
        this.content = new PIXI.Container();
        this.content.name = "content";
        this.title = new PIXI.Container();
        this.title.name = "title";
        this.tile.addChild(this.title);
        this.tile.addChild(this.content);
    }
}
export default cityTileView;