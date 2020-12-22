const PropertyModel = require("./propertyModel");

class StationModel extends PropertyModel{
    constructor(id, name, rentPrice, mortgagePrice, price, tile, isMortgaged, image) {
        super(id, name, rentPrice, mortgagePrice, price, tile);
        this.isMortgaged = isMortgaged;
        this.image = image;
        this.type = "StationModel";
    }

    getID(){
        return super.getID();
    }
}

module.exports = StationModel;