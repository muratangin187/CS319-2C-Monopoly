import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PersonIcon from '@material-ui/icons/Person';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    control: {
        padding: theme.spacing(2),
    },
    icon: {
        fontSize: 60,
    },
    typography: {
        fontSize : "0.55rem",
    },
}));

export default function PlayerList(props) {
    const classes = useStyles();
    return (
        <Grid container className={classes.root} justify="center" spacing={2}>
                {props.users && props.users.map(user => {
                    return (<Grid item><Paper className={classes.paper}>
                        {/*ID:{user.id} <br/> USERNAME:{user.username}*/}
                        <PersonIcon className={classes.icon}/>
                        <Typography className={classes.typography}>
                            <strong>Username:</strong> {user.username}
                        </Typography>
                    </Paper></Grid>)
                })
                }
        </Grid>
    );
}