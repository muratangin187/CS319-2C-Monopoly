import PropertyModel from "./propertyModel";

export default class StationModel extends PropertyModel{
    constructor(id, name, rentPrice, mortgagePrice, price, tile, card, isMortgaged, image) {
        super(id, name, rentPrice, mortgagePrice, price, tile, card, isMortgaged, image);
        this.image = image;
    }

}