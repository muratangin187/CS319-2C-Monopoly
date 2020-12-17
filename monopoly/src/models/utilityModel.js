const PropertyModel = require("./propertyModel");

class UtilityModel extends PropertyModel{
    constructor(id, name, rentPrice, mortgagePrice, price, tile, card, isMortgaged, image) {
        super(id, name, rentPrice, mortgagePrice, price, tile, card, isMortgaged);
        this.image = image;
    }


    getRentPrice(diceRoll, ownedUtilityNumber){
        if(ownedUtilityNumber === 1)
            return diceRoll * 4;

        return diceRoll * 10;
    }
}

module.exports = new UtilityModel;