class ViewManager{
    constructor() {
        // this.currentUserViews = {card: [], character: null};
        // window.initializeGame = this.initializeGame;
        // //window.test
        // console.log("constructor ");
    }

    initializeGame(currentPlayer){
        // draw board
        // draw initial properties
        let a = 0;
        console.log("Game initialized");
        currentPlayer.cards.forEach(card => {
            //this.currentUserViews.card.push(new cardView(card["type"]));

            card.x = a;
            a = a + 10;
        });

    }


    movePlayer(tileId){
        //this.currentUserViews.character;
    }

    setCards(newCards){
        //this.currentUserViews.cards.destroy();
        //newCards.forEach();

    }

    addCard(newCard){
        //this.currentUserViews.card.push();
    }

    removeCard(newCard){
        //this.currentUserViews.card.remove();
    }


}

module.exports = new ViewManager();