import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import monopoly_logo from "../../../images/Monopoly-Logo.svg";
import makeStyles from "@material-ui/core/styles/makeStyles";

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

const RoomOptionBody = (props) => {
    const classes = useStyles();
    return (
        <Grid container className={classes.grid_container} direction='column' justify='center' alignItems='center' spacing={2}>
            <Grid item className={classes.grid_item}>
                <img src={monopoly_logo} className={classes.img} alt="monopoly_logo"/>
            </Grid>
            <Grid item className={classes.grid_item}>
                <Button fullWidth variant='contained' onClick={() => props.setPage("createRoomPage")}>Create Room</Button>
            </Grid>
            <Grid item className={classes.grid_item}>
                <Button fullWidth variant='contained' onClick={() => props.setPage("selectRoomPage")}>Select Room</Button>
            </Grid>
        </Grid>
    );
}

export default RoomOptionBody;