class SpecialCardModel{

    /**
     * Special Cards:
     * Chance Cards with Natural Disaster and Profit Card
     * Chest Cards
     */
    construct(description){
        this.cardOwnerID = null;
        this.description = description;
    }
}

module.exports = SpecialCardModel();