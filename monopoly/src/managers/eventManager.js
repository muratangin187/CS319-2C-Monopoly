/*
Event arrayi alacak
her event etkiledigi tile ve playerlari tutacak, kim yarattiysa onu tutacak fonksiyonunu tutacak
event ekleme silme olacak
event bulma olacak tileid yada user vererek
Mesela:
0.tile, all users, add 200 money -> baslangic eventi

Murat bought 8.tile then create an Event
8.tile all users except Murat, add 50 money to murat, remove 50 money from effected user.


GameManager sunu yapabilmeli
->  EventManager.getEvents(currentUser, currentUser.tileId) -> [Event..]

 */
const EventModel = require("../models/eventModel");

class EventManager{

    constructor() {
        this.eventList = [];
        this.eventID = 0;
    }
    // Affected Tile, Player, EventCreator, Function
    createEvent(tileID, willBeEffected, createdBy, effect){
        let newEvent = new EventModel(this.eventID, tileID, willBeEffected, createdBy, effect);
        this.eventID++;
        this.eventList.push(newEvent);
    }

    removeEvent(createdBy, tileID){
        this.eventList.filter((event)=> (event.createdBy !== createdBy && event.tileID !== tileID));
    }

    getEvent(createdBy, tileID){
        return this.eventList.filter((event) => (event.tileID === tileID && event.createdBy === createdBy));
    }
}

module.exports = new EventManager();