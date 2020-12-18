import classNames from "classnames";
import React, {useEffect, useState} from "react";
import {Button, Card, H3, Overlay, Classes, Intent} from "@blueprintjs/core";
import Grid from '@material-ui/core/Grid';

const {ipcRenderer} = require('electron');

export default function CharacterList(props){
    const [charSelected, setCharSelected] = useState(-1);
    const [openIndex, setOpenIndex] = useState(-1);

    // to hold charArr from server
    const [characters, setCharacters] = useState([]);

    const classes = classNames(
        Classes.CARD,
        Classes.ELEVATION_4,
        "docs-overlay-example-transition"
    );

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

    return  (<Grid container spacing={2} style={{justifyContent: "center", alignItems: "center"}}>
        {characters.map((char, index) => {
                return (
                    <Card key={char.id} interactive={true} elevation={charSelected === index ? 4 : 1} style={{margin: 8}} onClick={()=>{setCharSelected(index);props.setSelectedCharId(char.id);}}>
                        <h5><a href="#">{char.charName}</a></h5>
                        <Button onClick={() => setOpenIndex(index)}>Description</Button>
                        <Overlay isOpen={index === openIndex} onClose={() => setOpenIndex(-1)} usePortal={true}>
                            <div className={classes}>
                                <H3>Description</H3>
                                <p>{char.description}</p>
                                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                    <Button intent={Intent.DANGER} onClick={() => setOpenIndex(-1)} style={{margin: ""}}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </Overlay>
                    </Card>);
            })
        }</Grid>)
}