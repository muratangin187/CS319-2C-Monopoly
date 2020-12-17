import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {Avatar} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import placeholder_logo from "../../../images/index.png";

const chars = ["placeholder", "placeholder", "placeholder", "placeholder"];

export default function CharacterList(){
    const [charSelected, setCharSelected] = useState(false);

    function handleClickSelect(){
        setCharSelected(!charSelected);
    }

    return (
        <Grid container>
            {chars.map(char => {
                return (
                    <Grid item>
                        <Card>
                            <CardHeader
                                avatar={charSelected ?
                                    (<Avatar>
                                        <ClearIcon />
                                    </Avatar>)
                                    :
                                    (<Avatar>
                                        <CheckIcon />
                                    </Avatar>)
                                }
                                action={
                                    <IconButton onClick={handleClickSelect}>
                                        <AddIcon />
                                    </IconButton>
                                }
                                //TODO make a map and fill the placeholders
                                title="placeholder"
                            />
                            <CardMedia
                                image={placeholder_logo}
                                title="placeholder"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Phasellus sed lectus at lacus posuere ultricies sed et eros.
                                    Aliquam vel mauris non sem bibendum eleifend. Ut et nisl euismod,
                                    lacinia orci eget, luctus quam. Sed non urna vitae mi iaculis ultrices.
                                    Class aptent taciti sociosqu ad litora torquent per conubia nostra,
                                    per inceptos himenaeos. Curabitur quis dolor sit amet mi vestibulum
                                    molestie. Pellentesque vel purus volutpat, pharetra nunc a, pharetra
                                    nulla.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}