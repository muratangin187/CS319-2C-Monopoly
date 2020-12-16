import React from "react";
import Grid from "@material-ui/core/Grid";
import monopoly_logo from '../../../images/Monopoly-Logo.svg'
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

const useStyles = makeStyles(() => ({
    grid_item: {
        width: "inherit",
    },
    grid_container: {
        width: "50vw",
        height: "100vh",
        margin: "auto",
    },
    img: {
        width: "-webkit-fill-available"
    },
}));

const OptionBody = () => {
    const classes = useStyles();

    const handleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    };

    return(
            <Grid container className={classes.grid_container} direction='column' justify='center' alignItems='center' spacing={2}>
                <Grid item className={classes.grid_item}>
                    <img src={monopoly_logo} className={classes.img} alt="monopoly_logo"/>
                </Grid>
                <Grid item className={classes.grid_item}>
                    <Button fullWidth variant='contained' startIcon={<FullscreenIcon />} onClick={handleFullscreen}>Fullscreen</Button>
                </Grid>
                <Grid item className={classes.grid_item}>
                    <Button fullWidth variant='contained' startIcon={<VolumeUpIcon />}>Sound</Button>
                </Grid>
                <Grid item className={classes.grid_item}>
                    <Button fullWidth variant='contained' startIcon={<MusicNoteIcon />}>Music</Button>
                </Grid>
            </Grid>
    );
}

export default OptionBody;