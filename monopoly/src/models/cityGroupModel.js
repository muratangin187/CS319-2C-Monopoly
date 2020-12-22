const CityModel = require("./cityModel");

class CityGroupModel {
    constructor(cities, color) {
        this.cities = cities;
        this.color = color;
    }

    getCityCount() {
        return this.cities.length;
    }

    /**
     *
     * @param playerId: number
     */
    isAllOwnedBy(playerId) {
        for (let i = 0; i < this.getCityCount(); i++) {
            //any city's owner is null, return false immediately.
            if (this.cities[i].ownerId === null) {
                return false;
            }
            if (this.cities[i].ownerId !== playerId) {
                return false;
            }
        }
        return true;
    }
}

module.exports = CityGroupModel;