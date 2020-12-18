const StateModel = require("../models/stateModel");

class StateManager{
    /**
     * Initial State is the beginning state
     *
     */
    constructor(){
        this.currentState = new StateModel();
        /*
            In state Model, we need to initialize:
             * @param players: PlayerModel[]
     * @param properties: PropertyModel[]
     * @param cities: CityModel[]
     * @param utilities: utilityModel[]
     * @param usableCards: specialCards[]
     * @param stations: stationModel[]
         */
    }

    updateState(newState){
        this.currentState = newState;
    }

    getState(){
        return this.currentState;
    }

}

module.exports = new StateManager();