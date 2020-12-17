const PlayerModel = require("../models/playerModel");

class PlayerManager{
    constructor() {
        this.players = {};
    }

    createPlayers(newPlayerList){
        this.players = {};
        newPlayerList.forEach((newPlayer)=>{
            let playerModel = new PlayerModel(newPlayer.id, newPlayer.username, null, null, 0);
            this.players[playerModel.id] = playerModel;
        });
    }

    getMoney(playerId){
        return this.players[playerId].money;
    }

    setMoney(playerId, amount){
        if(amount < 0 && !this.isMoneyEnough(playerId, amount))
            return false;
        this.players[playerId].money += amount;
        return true;
    }

    isMoneyEnough(playerId, amount){
        return this.players[playerId].money >= -amount;
    }

    /**
     * @param {int} playerId: Buyers ID
     * @param {PropertyModel} newProperty: PropertyModel Add to the player's properties
     * In the addProperty function, the owner of the newProperty is also updated
     */
    addProperty(playerId, newProperty){
        if(this.setMoney(playerId, newProperty.price)){
            console.log("addProperty removed money");
            newProperty.setOwner(playerId);
            this.players[playerId].properties.push(newProperty);
            console.log("addProperty added property");
            return true;
        }else{
            console.log("addProperty no money");
            return false;
        }
    }

    removeProperty(playerId, removedProperty){
        removedProperty.setOwner(null);
        this.players[playerId].properties.filter((property)=>property.id !== removedProperty.id);
    }

}

module.exports = new PlayerManager();
