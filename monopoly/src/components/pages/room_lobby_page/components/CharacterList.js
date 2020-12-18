import React, {useState} from "react";
import {Card} from "@blueprintjs/core";
import Grid from '@material-ui/core/Grid';
import placeholder_logo from "../../../images/index.png";

const chars = ["Character 1", "Character 2", "Character 3", "Character 4"];

export default function CharacterList(){
    const [charSelected, setCharSelected] = useState(-1);

    function handleClickSelect(index){
        if(charSelected === -1)
            setCharSelected(index);
    }

    return  (<Grid container spacing={2} style={{justifyContent: "center", alignItems: "center"}}>
        {chars.map((char, index) => {
                return (
                    <Card key={char} interactive={charSelected === -1} elevation={charSelected === index ? 4 : 1} style={{margin: 8}} onClick={()=>{handleClickSelect(index)}}>
                        <h5><a href="#">{char}</a></h5>
                        <p>Description</p>
                    </Card>);
            })
        }</Grid>)
}