import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from "@material-ui/core/Button";
import PasswordDialog from "./PasswordDialog";

const columns = [
    {
        id: 'room_name',
        label: 'Room name',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'password',
        label: 'Password',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'selectedBoard',
        label: 'Selected Board',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'joinButton',
        minWidth: 170,
        label: 'Join Button',
        align: 'right',
    },
];

const useStyles = makeStyles(() => ({
    root: {
        width: '75%',
        margin: "auto",
        textAlign: "center",
    },
    container: {
        maxHeight: 600,
    },
}));

const RoomList = (props) => {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = (password) => {
        if(password !== ""){
            setOpen(true);
        }
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
            <Paper className={classes.root}>
                <h1>Select A Room</h1>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, backgroundColor: "rgb(125, 125, 125)", color: "white" }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {
                                                        !(column.id === "joinButton") ? value : (
                                                            <Button color="primary" variant="contained" onClick={() => handleClickOpen(row["password"])}>
                                                                JOIN
                                                            </Button>
                                                        )
                                                    }
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={props.rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    style={{backgroundColor: "rgb(125, 125, 125)", color: "white"}}
                />
                <PasswordDialog open={open} handleClose={handleClose}/>
            </Paper>
    );
}

export default RoomList;