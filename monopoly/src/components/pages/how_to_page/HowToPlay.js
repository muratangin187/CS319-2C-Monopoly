import React, {useState} from "react";
import {Card, H1, Elevation, Collapse, Button, H3, H4} from "@blueprintjs/core";
import Header from "../../../components/pages/common/Header";

export default function HowToPlay(props){
    const [classicMonopolyColl, setClassicMonopolyColl] = useState(false);
    const [roomsColl, setRoomsColl] = useState(false);
    const [gameScreenColl, setGameScreenColl] = useState(false);

    const styles = {
        how_to_play: {
            display: "grid",
            gridTemplateRows: "64px auto",
            gridTemplateAreas: `
                "header"
                "body"  
            `,
        },
        header: {
            gridArea: "header",
        },
        body: {
            margin: 8,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
        },
        card:{
            margin: 8,
        }
    };

    const createRoomDesc = <p>In order to create a room you need to press <strong>"Start Game"</strong> and select <strong>"Create Room"</strong> option.
        In that screen you need to enter a room name and select a template from the selection box.
        You don't need to define a password to create a room. After pressing the <strong>"Create"</strong> button, dialog will show up and
        from that dialog box you need to enter a username to enter the room lobby. After you create a room this room will
        be displayed in the <strong>"Select Room"</strong> page of all other players.</p>;

    const selectRoomDesc = <p>In order to select a room which is created by an another player, you need to press <strong>"Start Game"</strong> button
        and select <strong>"Select Room"</strong> option. Then, you will see a list of rooms that you can join. If password is required for a room than,
        game will ask you to enter a password which is defined by the creator of the room. After entering username and password(optional), you will
        see the room lobby of that room.</p>;

    const roomLobbyDesc = <p>In the room lobby, you can chat by using the chat screen located in the left side of the screen and select a character
        from the character list. After deciding your character, you need to set your character as selected. In order to start the game you need to press
        the <strong>"Start Game"</strong> button.</p>;

    const scoreboardDesc = <p>By pressing the scoreboard button which is located in the game screen your can open a new portal which will be shown in the left
        side of the screen. From that screen, you can reach information about money, house, city, station, utility, color-groups etc. for each player in that game.</p>;

    const stateDesc = <p>You can see your current state from the card which is located left side of the game screen. If it is not your turn then in that card you will see
        a proctor that tells you that you need to wait until your turn. If it is your turn then in this card you will see buttons which are related with the game.</p>

    const chatWidgetDesc = <p>By pressing this widget, you can chat with other players.</p>

    const handDesc = <p>From the lower left corner of the screen, you can see your hand which contains your property cards, chance and treasure cards etc.</p>

    const boardDesc = <p>From board you can get information from specific properties and you can see your character. This board is customizable.</p>

    let classicMonopoly = (<Card interactive={true} elevation={Elevation.TWO} style={styles.card} onClick={() => {setClassicMonopolyColl(!classicMonopolyColl)}}>
        <div style={{display: "flex"}}><H3>Classic Monopoly</H3> <Button minimal={true} icon="expand-all" style={{paddingTop: 0}} onClick={() => {setClassicMonopolyColl(!classicMonopolyColl)}}/></div>
        <Collapse isOpen={classicMonopolyColl}>
            <ul>
                <li style={{margin: 4}}>On a player's turn, the player must roll the dice and move his/her token forward the number of spaces as rolled on the dice. In some editions, players must do any trades, building improvements etc. at the start of their turn before rolling the dice.</li>
                <li style={{margin: 4}}>If the player lands on an unowned property, the player may buy it for the price listed on that property's space. If he or she agrees to buy it, he or she pays the Bank the amount shown on the property space and receives the deed for that property. If he or she refuses to buy the property for the amount stated on the deed, the property is auctioned. Bidding may start at any price, and all players may bid. The highest bidder wins the property and pays the Bank the amount bid and receives the property's title deed. Railroads and utilities are also considered properties.</li>
                <li style={{margin: 4}}>If the player lands on an unmortgaged property owned by another player, he or she pays rent to that person, as specified on the property's deed. It is the property owner's responsibility to demand rent, and he or she has until the beginning of the second following player's turn to do so</li>
                <li style={{margin: 4}}>If the player lands on his or her own property, or on property which is owned by another player but currently mortgaged, nothing happens</li>
                <li style={{margin: 4}}>If the player lands on Luxury Tax/Super Tax, he or she must pay the Bank ₩100 (in some editions of the game, only ₩75).</li>
                <li style={{margin: 4}}>If the player lands on Income Tax he or she must pay the Bank either ₩200 or 10% of his or her total assets (cash on hand, property, houses and hotels). In some editions of the game, this is a flat rate of ₩200.</li>
                <li style={{margin: 4}}>If the player lands on a Chance or Community Chest, the player takes a card from the top of the respective pack and performs the instruction given on the card.</li>
                <li style={{margin: 4}}>If the player lands on the Jail space, he or she is "Just Visiting". No penalty applies.</li>
                <li style={{margin: 4}}>If the player lands on the Go to Jail square, he or she must move his token directly to Jail.</li>
                <li style={{margin: 4}}>If the player lands on or passes Go in the course of his or her turn, he or she receives ₩200 from the Bank. A player has until the beginning of his or her next turn to collect this money.</li>
                <li style={{margin: 4}}>You may sell houses back to the Bank for half the purchase price or sell property deeds to other players in the game.</li>
                <li style={{margin: 4}}>Players may not loan money to other players. Only the Bank can loan money, and only through mortgaging properties.</li>
                <li style={{margin: 4}}>If a player skips another player's turn and is caught, the turn is transferred back to the player whose turn was skipped.</li>
            </ul>
        </Collapse>
    </Card>);

    let rooms = (<Card interactive={true} elevation={Elevation.TWO} style={styles.card} onClick={() => {setRoomsColl(!roomsColl)}}>
        <div style={{display: "flex"}}><H3>Rooms</H3><Button minimal={true} icon="expand-all" style={{paddingTop: 0}} onClick={() => {setRoomsColl(!roomsColl)}}/></div>
        <Collapse isOpen={roomsColl}>
            <H4>Create a Room</H4>
            {createRoomDesc}
            <H4>Select a Room</H4>
            {selectRoomDesc}
            <H4>Room Lobby</H4>
            {roomLobbyDesc}
        </Collapse>
    </Card>);

    let gameScreen = (<Card interactive={true} elevation={Elevation.TWO} style={styles.card} onClick={() => {setGameScreenColl(!gameScreenColl)}}>
        <div style={{display: "flex"}}><H3>Game Screen</H3><Button minimal={true} icon="expand-all" style={{paddingTop: 0}} onClick={() => {setGameScreenColl(!gameScreenColl)}}/></div>
        <Collapse isOpen={gameScreenColl}>
            <H4>Scoreboard</H4>
            {scoreboardDesc}
            <H4>State Card</H4>
            {stateDesc}
            <H4>Chat Widget</H4>
            {chatWidgetDesc}
            <H4>Hand Screen</H4>
            {handDesc}
            <H4>Board Screen</H4>
            {boardDesc}
        </Collapse>
    </Card>);

    return (
        <div style={styles.how_to_play}>
            <Header setPage={props.setPage} prevPageName="mainPage" prevPageTitle="Main Page"/>
            <div style={{gridArea: "body"}}>
                <div style={{display: "flex", justifyContent: "center", marginTop: 16}}><H1><span style={{color:"red"}}>How</span> To <span style={{color:"red"}}>Play</span></H1></div>
                <Card style={styles.body}>
                    {classicMonopoly}
                    {rooms}
                    {gameScreen}
                </Card>
            </div>
        </div>
    );
}