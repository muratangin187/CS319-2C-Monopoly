import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog(props) {
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");
    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To join this room you need to enter the password of the room.
                    </DialogContentText>
                    {props.passwordRequired ?
                        (<><TextField
                        autoFocus
                        margin="dense"
                        id="username"
                        label="Username"
                        type="text"
                        fullWidth
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        onChange={(e)=>setPassword(e.target.value)}
                    /></>)
                    :
                        (<TextField
                        autoFocus
                        margin="dense"
                        id="username"
                        label="Username"
                        type="text"
                        fullWidth
                        onChange={(e)=>setUsername(e.target.value)}
                    />)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>props.handleClose(props.room, "cancel", password, username)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>props.handleClose(props.room, "join", password, username)} color="primary">
                        Join
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}