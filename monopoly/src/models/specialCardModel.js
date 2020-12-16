class SpecialCardModel{

    /**
     * Special Cards:
     * Chance Cards with Natural Disaster and Profit Card
     * Chest Cards
     */
    construct(){
        this.chanceCards = [];
        this.chestCards = [];
        this.createChanceCards();
        this.createChestCards();
        this.chanceCards = this.shuffle(this.chanceCards);
        this.chestCards = this.shuffle(this.chestCards);
    }

    /**
     * creates Chance Cards
     */
    createChanceCards(){
        const fs = require('fs');

        fs.readFileSync('Descriptions/chanceCards.txt', 'utf8');

        const descriptions = fs.split(/\\r?\\n/);

        descriptions.forEach(desc => {
            this.chanceCards.append(new Chance(desc));
        });

        console.log("Total number of Chance Cards is: ",this.chanceCards.length);
    }

    /**
     * creates Chest Cards
     */
    createChestCards(){
        const fs = require('fs');

        fs.readdirSync('Descriptions/chestCards.txt', 'utf8');

        const descriptions = fs.split(/\\r?\\n/);

        descriptions.forEach(desc => {
            this.chestCards.append(new Chance(desc));
        });

        console.log("Total number of Chest Cards is: ",this.chestCards.length);
    }

    /**
     * Only Constructor uses this method
     * @param array: Card List
     * @return array: shuffled array
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // Generate random number
            let j = Math.floor(Math.random() * (i + 1));

            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }
    // Below might be handled in Manager?
    /*
    /**
     * When a card is drawn, the card placed at the bottom of the pile
     * @param cards: Card list (Chest or Community)
     * @returns cards: Card List
     */
    /*drawCard(cards){
        let card = cards[0];
        let description = cards[0].description;

        if(description === "Get Out of Jail Free")
            //Player.addCard(card);
            return cards;
        cards.splice(0, 1);

        cards.append(card);

        return cards;
    }*/

    /**
     * Chest Card is Drawn
     */
    /*drawChestCard(){
        this.chestCards = this.drawCard(this.chestCards);
    }*/

    /**
     * Chance Card is drawn
     */
    /*drawChanceCard(){
        this.chanceCards = this.drawCard(this.chanceCards);
    }*/
}