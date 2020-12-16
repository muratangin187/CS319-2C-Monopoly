class stateModel{
    /**
     * Reviewed Later
     * @param players: PlayerModel[]
     * @param properties: PropertyModel[]
     * @param cities: CityModel[]
     * @param utilities: utilityModel[]
     * @param usableCards: specialCards[]
     * @param stations: stationModel[]
     */
    constructor(players, properties, cities, utilities, usableCards, stations ){
        this.players = players;
        this.properties = properties;
        this.cities = cities;
        this.utilities = utilities;
        this.usableCaards = usableCards;
        this.stations = stations;
    }
}