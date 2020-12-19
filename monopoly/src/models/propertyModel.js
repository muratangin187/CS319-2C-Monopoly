class PropertyModel {
    constructor(id, name, rentPrice, mortgagePrice, price, tile, card) {
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
    getID(){
        return this.id;
    }
    setOwner(newOwner) {
        this.ownerId = newOwner;
    }

    mortgage() {
        this.isMortgaged = true;
        return this.mortgagePrice;
    }

    /**
     * Lifts the mortgage and returns the amount a user needs to pay
     * @returns {number}
     */
    liftMortgage() {
        this.isMortgaged = false;
        //amount of money that player needs to pay
        return this.mortgagePrice * 1.1;
    }

    //
    getRentPrice() {
        if (this.isMortgaged) {
            return 0;
        }
        return this.rentPrice[0];
    }

    isOwned() {
        return this.ownerId !== null;
    }
}

module.exports = PropertyModel;