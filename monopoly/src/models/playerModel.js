/*
    id: number
    username: string
    avatar: object
    properties = Property[]
    cards = Card[]
    currentTile = number
    state = State
    character = int
------------
    move = (newTileID = number)
    addProperty = newProperty: Property
    addCard = newCard: Card
    removeCard = card: Card
    changeState = newState: State
 */

class PlayerModel{
    /**
     *
     * @param {int} id: User ID
     * @param {String} username: Username
     * @param {Object} avatar: Picture (Object)
     * @param {State} state: State: Send the Initial State
     * @param {int} character: Player's Character ID
     * In constructor;
     * the cards[] is set to []
     * the properties[] is set to []
     * currentTile = 0
     *
     * because initially all the players are at the Start => 0
     * and no one owns anything
     */
    constructor(id, username, avatar, state, character){
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.state = state;
        this.character = character;
        this.money = 200;
        this.inJail = false;
        this.inJailLeft = 0;
        this.doubleCount = 0;
        this.cards = [];
        this.properties = [];
        this.currentTile = 0;
    }
    getID(){
        return this.id;
    }
    /**
     *
     * @param newTileID: int
     * @param passedStart: boolean
     *
     * if the player passes start, increase the money
     *      * The condition of passing "Go" is checked before calling move
     */
    move(newTileID, passedStart){
        this.currentTile = newTileID;

        if(passedStart)
            this.money += 200;
    }
    /*
    addProperty = newProperty: Property
    addCard = newCard: Card
    removeCard = card: Card
    changeState = newState: State
    */

    //SELL PROPERTY EKLENECEK

    /**
     *
     * @param newCard: Card
     *
     * Adds card to the Card collection cards[]
     */
    addCard(newCard){
        this.cards.push(newCard);
    }

    changeState(newState){
        this.state = newState;
    }


}

module.exports = PlayerModel;