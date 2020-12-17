import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing(1),
    },
    appBar: {
      backgroundColor: "white",
    },
}));

const Header = (props) => {
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <Button
                    className={classes.button}
                    startIcon={<ArrowBackIcon />}
                    onClick={() => props.setPage(props.prevPageName)}
                >
                    {props.prevPageTitle}
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;