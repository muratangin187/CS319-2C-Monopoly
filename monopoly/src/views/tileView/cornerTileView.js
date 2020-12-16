import * as PIXI from 'pixi.js'
import tileView from "./tileView";

class CornerTileView extends tileView{
    constructor(image, tileId) {
        super(tileId);
        this.image = new PIXI.Sprite(image);
        this.tile.addChild(this.image);
        this.initializeDrawings()
    }

    initializeDrawings() {
        super.initializeDrawings();

        this.image.width = this.size-2;
        this.image.height = this.size-2;
        this.image.x = this.x;
        this.image.y = this.y;
    }
}
export default CornerTileView;
