// Include to a proper class

class QuestsModel{
    /**
     * Should we write the check conditions in here or in Game Manager class.
     * @param quest1 = int[] => Holds the locations of the seven Wonders
     * @param quest2 = {int[], int[]} => Key holds the CityIDs where item holds the dice combinations
     */
    constructor(quest1, quest2){
        this.quest1 =  quest1;
        this.quest2 = quest2;
    }
}

module.exports = QuestsModel;