const SpecialCardModel = require("../models/specialCardModel");
const chanceDesc = require("../Descriptions/chanceCards");
const chestDesc = require("../Descriptions/chestCards");
class CardManager {
   constructor() {
      this.cards = [];

      this.chanceCards = [];
      this.chestCards = [];
      this.createChanceCards();
      this.createChestCards();
      this.chanceCards = this.shuffle(this.chanceCards);
      this.chestCards = this.shuffle(this.chestCards);

   }

   setCards(newCards){
      this.cards = newCards;
   }

   getCardById(cardId){
      return this.cards.find((card) => card.id === cardId);
   }

   /**
    * creates Chance Cards
    */
   createChanceCards(){
      const fs = require('fs');
      let count = 0;
      chanceDesc.forEach(desc => {
         this.chanceCards.push(new SpecialCardModel(count,desc));
         count++;
      });

      console.log("Total number of Chance Cards is: ",this.chanceCards.length);
   }

   /**
    * creates Chest Cards
    */
   createChestCards(){
      const fs = require('fs');
      let count = 0;
      chestDesc.forEach(desc => {
         this.chestCards.push(new SpecialCardModel(count, desc));
         count++;
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
   drawChanceCard(){
      let card = this.chanceCards[0];

      this.chanceCards.splice(0,1);

      return card;
   }

   drawChestCard(){
      let card = this.chestCards[0];

      this.chestCards.splice(0,1);

      return card;
   }

   addChanceCard(cardID, description){
      this.chanceCards.push(new SpecialCardModel(cardID, description));
   }

   addChestCard(cardID, description){
      this.chestCards.push(new SpecialCardModel(cardID, description));
   }
}

module.exports = new CardManager();
