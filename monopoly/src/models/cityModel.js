class CityModel {

    constructor(houseCost, hotelCost, buildings, cityGroup) {
        this.houseCost = houseCost;
        this.hotelCost = hotelCost;
        this.buildings = buildings;
        this.cityGroup = cityGroup;
    }

    setBuildings(newBuilding) {
        this.buildings.push(newBuilding);
    }

    sellBuilding(buildingType) {
        if (!(buildingType.localeCompare('hotel')) || !(buildingType.localeCompare('house'))) {
            return false;
        }

        for (let i = 0; i < this.buildings.length; i++) {
            if (buildingType.localeCompare('hotel')) {
                if (this.buildings[i].type.localeCompare('hotel')) {
                    this.buildings.splice(i, 1);
                    return true;
                }
            }
            else if (buildingType.localeCompare('house')) {
                if (this.buildings[i].type.localeCompare('house')) {
                    this.buildings.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }
}