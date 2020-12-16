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
     * @param id: User ID
     * @param username: Username
     * @param avatar: Picture (Object)
     * @param state: State: Send the Initial State
     * @param character: Player's Character ID
     * @param money: money: int => Send the initial budget
     * In constructor;
     * the cards[] is set to []
     * the properties[] is set to []
     * currentTile = 0
     *
     * because initially all the players are at the Start => 0
     * and no one owns anything
     */
    construct(id, username, avatar, state, character, money){
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.state = state;
        this.character = character;
        this.money = money;

        this.cards = [];
        this.properties = [];
        this.currentTile = 0;
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
    /**
     *
     * @param newProperty: PropertyModel Add to the player's properties
     *
     * In the addProperty function, the owner of the newProperty is also updated
     */
    addProperty(newProperty){
        this.properties.push(newProperty);
        //newProperty.setOwner(this.id);
        //newProperty.sellOwner(newOwner) => ?
    }

    /**
     *
     * @param newCard: Card
     *
     * Adds card to the Card collection cards[]
     */
    addCard(newCard){
        this.cards.push(newCard);
    }

    /**
     *
     * @param card: Card
     * removes the card from card list
     * if the card is not exist, console.log error message
     */
    removeCard(card) {
        const index = this.cards.indexOf(card);
        if(index !== -1){
            this.cards.splice(index, 1);
        }
        else{
            console.log("No Card found");
        }
    }

    changeState(newState){
        this.state = newState;
    }


}
