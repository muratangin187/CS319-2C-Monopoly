class TradeManager {
    /**
     *
     * @param {PlayerModel[]}players
     * @param {PropertyModel}property
     */
    constructor(players, property) {
        this.currentBid = 0;
        this.highestBidderID = -1;
        this.remainingPlayers = players;
    }

    withDrawn(playerID) {
        this.remainingPlayers.filter(player => player.id !== playerID);
    }

    newBid(playerID, bid) {
        if (bid === 0)
            this.withDrawn(playerID, bid);

        else {
            let player = this.remainingPlayers.filter(pl => pl.id === playerID);

            if (!player.isMoneyEnough(playerID, -bid)) {
                console.log("Cannot bid due to not enough money");
                return false;
            }

            this.highestBidderID = playerID;
            this.currentBid = bid;
        }

        return true;
    }


    closeTrade(){
        let winner = [];
        if(this.remainingPlayers.length === 1)
            winner = [this.highestBidderID, this.currentBid];

        return winner;
    }
}

module.exports = TradeManager;