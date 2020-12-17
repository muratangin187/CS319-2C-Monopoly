import StateModel from "./stateModel"
class EventModel{
    /**
     * eventModel is based on eventProps Class in Design Report 2
     * event and tile IDs can be String. Why not String
     * @param {int} eventID: int
     * @param {int} tileID: int
     * @param {PlayerModel[]} willBeEffected: PlayerModel[]
     * @param {PlayerModel} createdBy: PlayerModel
     * @param {function} effect: function
     */
    constructor(eventID, tileID, willBeEffected, createdBy, effect) {
        this.eventID = eventID;
        this.willBeEffected = willBeEffected;
        this.createdBy = createdBy;
        this.effect = effect;
    }
}