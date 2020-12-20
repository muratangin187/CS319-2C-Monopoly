const socketIOClient = require("socket.io-client");
const mainWindow = require("../../main").mainWindow;
class NetworkManager {
    constructor() {
        this.socket = socketIOClient("http://localhost:3000");
        this.rooms = [];
        this.socket.on("get_rooms_sb", (...args) => {
            console.log("main - get_rooms_sb");
            this.rooms = args[0];
            console.log("ROOMS: " + JSON.stringify(this.rooms,null,2));
            mainWindow.send("get_rooms_bf", this.rooms);
        });
        this.socket.on("change_page_sb", (...args) => {
            console.log("main - change_page_sb");
            this.currentUser = args[0].users.find((user)=>user.id === this.socket.id);
            if(this.rooms.find((room)=>room.room_name === args[0].room))
                this.rooms.find((room)=>room.room_name === args[0].room).users = args[0].users;
            console.log("ROOMS: " + JSON.stringify(this.rooms,null,2));
            console.log("CURRENT USER: " + JSON.stringify(this.currentUser));
            mainWindow.send("change_page_bf", {result:args[0], currentUser: this.currentUser});
        });

        this.socket.on("update_room_users_sb", (args) => {
            console.log("main - update_room_users_sb");
            this.rooms.find((room)=>room.room_name === args.roomName).users = args.users;
            mainWindow.send("update_room_users_bf", args.users);
        });

        this.socket.on("move_player_sb", (args) => {
            mainWindow.send("move_player_bf", args);
        });

        /**
         * signal_from: get_characters_sb
         * signal_to: get_characters_bf
         * sending character array (nm -> RoomLobbyPage.CharacterList)
         * */
        this.socket.on('get_characters_sb', (characters) => {
            console.log("Character Object Array:");
            console.log(characters);
            mainWindow.send("get_characters_bf", characters);
        });

        /**
         * signal_from: set_character_sb
         * signal_to: set_character_bf
         * msgObj: {success, message}
         * */
        this.socket.on('set_character_sb', msgObj => {
            console.log("MESSAGE");
            console.log(msgObj);

            mainWindow.send('set_character_bf', msgObj);
        });

        this.socket.on('get_messages_sb', messages => {
            console.log("MESSAGES");
            console.log(messages);
            mainWindow.send('get_messages_bf', messages);
        });

        this.socket.on('send_message_sb', msgObj => {
            mainWindow.send('send_message_bf', msgObj);
        });

        this.socket.on('send_message_widget_sb', messageObj => {
            mainWindow.send('send_message_widget_bf', messageObj);
        });

    }

    movePlayer(destinationTileId){
        this.socket.emit("move_player_bs", {playerId: this.getCurrentUser().id, destinationTileId: destinationTileId});
    }

    setUpdatePlayerListener(func){
        this.socket.on("update_players_sb", (players)=>{
            func(players);
        });
    }

    setAuctionListener(func){
        this.socket.on("auction_sb", args =>{
            let winnerId = args.winnerId;
            let propertyModel = args.propertyModel;
            let bidAmount = args.bidAmount;
            let auctionStarter = args.auctionStarter;
            func(winnerId, propertyModel, bidAmount, auctionStarter);
        });
    }

    setUpdatePropertyListener(func){
        this.socket.on("update_property_sb", (properties)=>{
            func(properties);
        });
    }

    setStateListener(func){
        this.socket.on("next_state_sb", (stateObject) => {
            func(stateObject);
        });
    }

    setMoveListener(func){
        this.socket.on("move_player_sb", (args) => {
            func(args);
            mainWindow.send("move_player_bf", args);
        });
    }

    setStartGameListener(func){
        this.socket.on("start_game_sb", (roomObject)=>{
            // func(this.getRoom(roomObject.room_name));
            func(roomObject);
            mainWindow.send("start_game_bf", roomObject);
        });
    }

    getRoom(roomName){
        return this.rooms.find((room) => room.room_name === roomName);
    }

    setAuction(propertyModel, bidAmount){
        this.socket.emit("auction_bs", {propertyModel: propertyModel, bidAmount:bidAmount, userId: this.currentUser.id});
    }

    getCurrentUser(){
        return this.currentUser;
    }

    determineStartOrder(sum){
        this.socket.emit("determineStartOrder_bs", {sum: sum, userId: this.currentUser.id});
    }

    createRoom(args) {
        this.socket.emit("create_room_bs", args);
    }

    startGame(roomName){
        this.socket.emit("start_game_bs", roomName);
    }

    joinRoom(args){
        console.log("EMIT ON NETWORK:" + args.roomName + " - " + args.username);
        this.socket.emit("join_room_bs", args);
    }

    /**
     * signal_to: set_character_bs
     * setCharObj: {roomName, currentUser, selectedCharId}
     * */
    setCharacter(setCharObj){
        this.socket.emit("set_character_bs", setCharObj);
    }

    /**
     * signal_to: get_characters_bs
     * Request sending from server to get character list
     * */
    getCharacters(){
        this.socket.emit('get_characters_bs');
    }

    getMessages(){
        this.socket.emit('get_messages_bs');
    }

    sendMessage(messageObj){
        this.socket.emit('send_message_bs', messageObj);
    }

    sendWidgetMessage(messageObj){
        this.socket.emit('send_message_widget_bs', messageObj);
    }

    updatePlayers(players){
        this.socket.emit("update_players_bs", players);
    }

    updateProperties(properties){
        this.socket.emit("update_properties_bs", {properties: properties, currentUserId: this.currentUser.id});
    }

    nextState(){
        this.socket.emit("next_state_bs", this.getCurrentUser().id);
    }
}

module.exports = new NetworkManager();