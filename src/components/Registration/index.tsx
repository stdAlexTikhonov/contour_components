import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    container: {
      display: "flex",
      height: "500px",
    },
  })
);

export const RegistrationForm = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="filled-basic" label="Login" variant="outlined" />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"
        />
        <TextField id="outlined-basic" label="Firstname" variant="outlined" />
        <TextField id="outlined-basic" label="Surname" variant="outlined" />
        <TextField id="outlined-basic" label="Email" variant="outlined" />
        <Button variant="contained" color="primary">
          Register
        </Button>
      </form>
    </div>
  );
};
