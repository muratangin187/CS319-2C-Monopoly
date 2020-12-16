class Globals{
    constructor(){
        this.app = null;
        this.CONSTS = {
            USABLE_TYPE: {
                CHANCE: 0,
                CHEST: 1,
                QUEST: 2
            }
        };
        this.sizeOfBoard = 1010;
    }
}
export default (new Globals())