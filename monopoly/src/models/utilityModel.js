import PropertyModel from "./propertyModel";

export default class UtilityModel extends PropertyModel{
    constructor(id, name, rentPrice, mortgagePrice, price, tile, card, isMortgaged) {
        super(id, name, rentPrice, mortgagePrice, price, tile, card, isMortgaged);
    }


    getRentPrice(diceRoll, ownedUtilityNumber){
        if(ownedUtilityNumber === 1)
            return diceRoll * 4;

        return diceRoll * 10;
    }

}