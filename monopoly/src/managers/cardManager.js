class CardManager {
   constructor() {
      this.cards = [];
   }

   setCards(newCards){
      this.cards = newCards;
   }

   getCardById(cardId){
      return this.cards.find((card) => card.id === cardId);
   }

}

module.exports = new CardManager();
