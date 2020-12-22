import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PersonIcon from '@material-ui/icons/Person';
import Typography from "@material-ui/core/Typography";
import {Avatar} from "@material-ui/core";
import {green, purple, red} from "@material-ui/core/colors";
import blue from "@material-ui/core/colors/blue";

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
    const theme = useTheme();

    const avatarStyle = [
        {
            color: theme.palette.getContrastText(red[900]),
            backgroundColor: red[900],
            margin: 16
        },
        {
            color: theme.palette.getContrastText(red[900]),
            backgroundColor: green[900],
            margin: 16
        },
        {
            color: theme.palette.getContrastText(red[900]),
            backgroundColor: blue[900],
            margin: 16
        },
        {
            color: theme.palette.getContrastText(red[900]),
            backgroundColor: purple[900],
            margin: 16
        },
    ];

    return (
        <Grid container className={classes.root} justify="center" spacing={2}>
                {props.users && props.users.map(user => {
                    let result;

                    result = <PersonIcon className={classes.icon}/>;

                    if (user.id === props.currentUser.id)
                        if (props.selectedCharId !== -1)
                            result = <Avatar style={avatarStyle[props.selectedCharId - 1]}>{props.selectedCharName.charAt(0)}</Avatar>;

                    return (<Grid item><Paper className={classes.paper}>
                        {result}
                        <Typography className={classes.typography}>
                            <strong>Username:</strong> {user.username}
                        </Typography>
                    </Paper></Grid>)
                })
                }
        </Grid>
    );
}