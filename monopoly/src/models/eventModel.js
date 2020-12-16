import StateModel from "./stateModel"
class eventModel{
    /**
     * eventModel is based on eventProps Class in Design Report 2
     * event and tile IDs can be String. Why not String
     * @param eventID: int
     * @param tileID: int
     * @param willBeEffected: PlayerModel[]
     * @param createdBy: PlayerModel
     * @param effect: function
     */
    constructor(eventID, tileID, willBeEffected, createdBy, effect) {
        this.eventID = eventID;
        this.willBeEffected = willBeEffected;
        this.createdBy = createdBy;
        this.effect = effect;
    }
}