import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useFormik} from "formik";
import BoardSelectionBox from "./BoardSelectionBox";
const {ipcRenderer} = require("electron");

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: "auto",
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        height: "88vh",
        display: "flex",
    },
}));

export default function CreateRoom() {
    const formik = useFormik({
        initialValues: {
            room_name: "",
            password: "",
            selectedBoard: "",
        },
        onSubmit: roomModel => {
            //send roomModel object to gameManager
            console.log(JSON.stringify(roomModel))
            ipcRenderer.send('create_room', roomModel);
        }
    });

    const setSelectedBoard = (selectedBoard) => {
        formik.values.selectedBoard = selectedBoard;
    };

    const classes = useStyles();

    const [boards, setBoards] = useState(["Template-1", "Template-2"]);
    return (
        <Container className={classes.container} component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    CREATE ROOM
                </Typography>
                <form className={classes.form} onSubmit={formik.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Room name"
                        name="room_name"
                        autoFocus
                        onChange={formik.handleChange}
                        value={formik.values.room_name}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    <BoardSelectionBox boards={boards} setSelectedBoard={setSelectedBoard}/>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        CREATE
                    </Button>
                </form>
            </div>
        </Container>
    );
}