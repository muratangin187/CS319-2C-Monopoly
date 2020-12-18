import React, {useEffect, useState} from "react";
import {Card} from "@blueprintjs/core";
import Grid from '@material-ui/core/Grid';

const {ipcRenderer} = require('electron');

export default function CharacterList(){
    const [charSelected, setCharSelected] = useState(-1);

    // to hold charArr from server
    const [characters, setCharacters] = useState([{id: -1, charName: "Test", description: "Test"}]);

    useEffect(() => {
        /**
         * characters: [{id, charName, description}]
         * */
        function getCharactersListener(event, characters){
            console.log("Characters are set.");
            console.log(characters);
            setCharacters(characters);
        }

        ipcRenderer.on("get_characters_bf", getCharactersListener); // taking character array

        ipcRenderer.send("get_characters_fb"); // request for getting characters to game manager

        return () => {
            ipcRenderer.removeListener("get_characters_bf", getCharactersListener);
        }; // componentWillUnmount
    }, []); // componentDidMount

    function handleClickSelect(index){
        if(charSelected === -1)
            setCharSelected(index);
    }

    return  (<Grid container spacing={2} style={{justifyContent: "center", alignItems: "center"}}>
        {characters.map((char, index) => {
                return (
                    <Card key={char.id} interactive={charSelected === -1} elevation={charSelected === index ? 4 : 1} style={{margin: 8}} onClick={()=>{handleClickSelect(index)}}>
                        <h5><a href="#">{char.charName}</a></h5>
                        <p>{char.description}</p>
                    </Card>);
            })
        }</Grid>)
}