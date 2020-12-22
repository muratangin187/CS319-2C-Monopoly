const PlayerModel = require("./playerModel");
const CityModel = require("./cityModel");
const UtilityModel = require("./utilityModel");
const StationModel = require("./stationModel");
const SpecialCardModel = require("./specialCardModel");

class StateModel{
    /**
     * Reviewed Later
     * @param {PlayerModel[]}players
     * @param {PropertyModel[]}properties
     * @param {CityModel[]}cities
     * @param {utilityModel[]}utilities
     * @param usableCards: specialCards[]
     * @param stations: stationModel[]
     */
    constructor(players, properties, cities, utilities, usableCards, stations){
        this.players = players;
        this.properties = properties;
        this.cities = cities;
        this.utilities = utilities;
        this.usableCards = usableCards;
        this.stations = stations;
    }
}

module.exports = StateModel;