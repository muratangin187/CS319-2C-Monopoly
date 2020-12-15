

class PropertyModel {
    constructor(id, name, rentPrice, mortgagePrice, price, tile, card, isMortgaged) {
        this.id = id;
        this.name = name;
        this.rentPrice = rentPrice;
        this.mortgagePrice = mortgagePrice;
        this.price = price;
        this.ownerId = null;
        this.tile = tile;
        this.card = card;
        this.isMortgaged = false;
    }

    sell(newOwner) {
        this.ownerId = newOwner;
        return true;
    }

    mortgage() {
        this.isMortgaged = true;
    }

    liftMortgage() {
        this.isMortgaged = false;
        //amount of money that player needs to pay
        let amount = this.mortgagePrice * 1.1;
    }

    getRentPrice() {
        return this.rentPrice[0];
    }

    isOwned() {
        return this.ownerId != null;
    }
}