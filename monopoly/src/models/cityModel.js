import PropertyModel from "./propertyModel";

export default class CityModel extends PropertyModel {

    /**
     * Creates a city data model
     * @param id
     * @param name
     * @param rentPrice
     * @param mortgagePrice
     * @param price
     * @param tile
     * @param card
     * @param houseCost
     * @param hotelCost
     * @param buildings
     * @param cityGroup
     */
    constructor(id, name, rentPrice, mortgagePrice, price, tile, card, houseCost, hotelCost, buildings, cityGroup) {
        super(id, name, rentPrice, mortgagePrice, price, tile, card);
        this.houseCost = houseCost;
        this.hotelCost = hotelCost;
        this.buildings = buildings;
        this.cityGroup = cityGroup;
        this.houseCount = 0;
        this.hotelCount = 0;
    }

    /**
     *  //below shows the rents of city for different combinations:
        //0 house -> rentPrice[0]
        //1 house -> rentPrice[1]
        //2 houses -> rentPrice[2]
        //3 houses -> rentPrice[3]
        //4 houses -> rentPrice[4]
        //1 hotel -> rentPrice[5]
     * @returns {number|*}
     */
    getRentPrice() {

        //if all cities in the same color group are owned, rent is doubled
        let double = this.cityGroup.isAllOwnedBy(this.ownerId);
        // if (this.ownerId != null) {
        //     for (let j = 0;  j < this.cityGroup.getCityCount(); j++) {
        //         if (this.cityGroup[j].ownerId != this.ownerId) {
        //             double = false;
        //         }
        //     }
        // }

        //double the rent price
        if (double) {
            this.rentPrice[0] *= 2
        }

        //index 5 means that, the property has 4 houses and 1 hotels.
        //max number of houses is 4.
        let index = this.houseCount + this.hotelCount * 5;
        return super.getRentPrice() + this.rentPrice[index];
    }

    //mortgages the city and returns the amount needs to be added to player's balance
    mortgage() {
        let addedMoney = super.mortgage();
        //money that goes to the player.
        addedMoney += (this.houseCount * this.houseCost) / 2 + (this.hotelCount * this.hotelCost) / 2;
        this.hotelCount = 0;
        this.houseCount = 0;
        this.buildings = null;
        return addedMoney;
    }
}