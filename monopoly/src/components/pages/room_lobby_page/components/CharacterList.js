import React, {useEffect, useState} from "react";
import {Button, Card, H3, Dialog, Intent} from "@blueprintjs/core";
import Grid from '@material-ui/core/Grid';
import Avatar from "@material-ui/core/Avatar";
import {green, purple, red} from "@material-ui/core/colors";
import useTheme from "@material-ui/core/styles/useTheme";
import blue from "@material-ui/core/colors/blue";

const {ipcRenderer} = require('electron');

export default function CharacterList(props){
    const theme = useTheme();

    const [charSelected, setCharSelected] = useState(-1);
    const [openIndex, setOpenIndex] = useState(-1);

    // to hold charArr from server
    const [characters, setCharacters] = useState([]);

    const cardStyle = {
        margin: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    };

    const avatarStyle = [
        {
            color: theme.palette.getContrastText(red[900]),
            backgroundColor: red[900]
        },
        {
            color: theme.palette.getContrastText(red[900]),
            backgroundColor: green[900]
        },
        {
            color: theme.palette.getContrastText(red[900]),
            backgroundColor: blue[900]
        },
        {
            color: theme.palette.getContrastText(red[900]),
            backgroundColor: purple[900]
        },
    ];

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
                    <Card key={char.id} interactive={index < 2} elevation={charSelected === index ? 4 : 1} style={cardStyle} onClick={()=>{if(index >= 2) return; setCharSelected(index);props.setSelectedCharId(char.id);props.setSelectedCharName(char.charName);}}>
                        <Avatar style={avatarStyle[index]}>{char.charName.charAt(0)}</Avatar>
                        <h5><a href="#">{char.charName}</a></h5>
                        <Button onClick={() => setOpenIndex(index)}>Description</Button>
                        <Dialog isOpen={index === openIndex} onClose={() => setOpenIndex(-1)} usePortal={true}>
                            <div style={{margin: "50px"}}>
                                <H3>Description</H3>

                                <p>{char.description}</p>
                                    <Button intent={Intent.DANGER} onClick={() => setOpenIndex(-1)} style={{margin: ""}}>
                                        Close
                                    </Button>
                            </div>
                        </Dialog>
                    </Card>);
            })
        }</Grid>)
};