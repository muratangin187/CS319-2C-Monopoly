class BoardModel{
    /**
     *
     * @param color: String. City Group's color
     * @param tile:  String. Tile of the Location
     * @param image: Image. Image of the Location
     * @param price: float. Fee of the Location
     *
     * To not display, image or color send 0 or null
     */
    constructor(color, tile, image, price){
        this.color = color;
        this.tile = tile;
        this.image = image;
        this.price = price;
    }
}

module.exports = BoardModel;