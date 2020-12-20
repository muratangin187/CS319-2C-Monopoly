const PropertyModel = require("./propertyModel");

class UtilityModel extends PropertyModel{
    constructor(id, name, rentPrice, mortgagePrice, price, tile, isMortgaged, image) {
        super(id, name, rentPrice, mortgagePrice, price, tile, isMortgaged);
        this.image = image;
        this.type = "UtilityModel";
    }

    getID(){
        return super.getID();
    }

    getRentPrice(diceRoll, ownedUtilityNumber){
        if(ownedUtilityNumber === 1)
            return diceRoll * 4;

        return diceRoll * 10;
    }
}

module.exports = UtilityModel;