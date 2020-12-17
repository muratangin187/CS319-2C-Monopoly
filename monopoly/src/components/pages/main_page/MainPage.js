import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import monopoly_logo from '../../images/Monopoly-Logo.svg'
import {makeStyles} from "@material-ui/core";
import {ipcRenderer} from "electron";

const useStyles = makeStyles( () => ({
    mainPage: {
        display: "flex",
        height: "100vh",
        width: "100vw",
    },
    mainPageLogo: {
        width: "50vw",
        pointerEvents: "none",
    },
}));

function MainPage(props) {
    const classes = useStyles();

    const handleExit = () => {
        window.close();
    };

    return (
        <div className={classes.mainPage}>
            <Grid container justify='center' alignItems='center'  style={{margin: "auto"}}>
                <Grid container direction='column' justify='center' alignItems='center' spacing={2} style={{width: "50vw"}}>
                    <Grid item>
                        <img src={monopoly_logo} className={classes.mainPageLogo} alt="monopoly_logo"/>
                    </Grid>
                    <Grid item style={{width: "inherit"}}>
                        <Button fullWidth variant='contained' onClick={() => props.setPage("roomOptionPage")}>Start Game</Button>
                    </Grid>
                    <Grid item style={{width: "inherit"}}>
                        <Button fullWidth variant='contained' onClick={() => props.setPage("optionPage")}>Options</Button>
                    </Grid>
                    <Grid item style={{width: "inherit"}}>
                        <Button fullWidth variant='contained' onClick={() => ipcRenderer.send("start_game_fb", "Test")}>Play game</Button>
                    </Grid>
                    <Grid item style={{width: "inherit"}}>
                        <Button fullWidth variant='contained' onClick={() => ipcRenderer.send("buy_property_fb", 0)}>Buy Ankara</Button>
                    </Grid>
                    <Grid item style={{width: "inherit"}}>
                        <Button fullWidth variant='contained' onClick={handleExit}>Exit</Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default MainPage;