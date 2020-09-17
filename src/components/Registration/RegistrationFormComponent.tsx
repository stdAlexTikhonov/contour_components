import React from "react";
import { useStyles } from "./styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { IProps } from "./types";
import ThemeProvider from "../CustomDropdown/ThemeProvider";

export const RegistrationFormComponent: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const refLogin: any = React.createRef();
  const refPassword: any = React.createRef();
  const refFirstname: any = React.createRef();
  const refSurname: any = React.createRef();
  const refEmail: any = React.createRef();

  return (
    <ThemeProvider>
      <div className={classes.container}>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="filled-basic"
            label="Login"
            variant="outlined"
            inputRef={refLogin}
          />
          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            inputRef={refPassword}
          />
          <TextField
            id="outlined-basic-1"
            label="Firstname"
            variant="outlined"
            inputRef={refFirstname}
          />
          <TextField
            id="outlined-basic-2"
            label="Surname"
            variant="outlined"
            inputRef={refSurname}
          />
          <TextField
            id="outlined-basic-3"
            label="Email"
            variant="outlined"
            inputRef={refEmail}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ backgroundColor: "#003366" }}
            onClick={() =>
              props.handleRegister(
                refLogin.current,
                refPassword.current,
                refFirstname.current,
                refSurname.current,
                refEmail.current
              )
            }
          >
            Register
          </Button>
        </form>
      </div>
    </ThemeProvider>
  );
};
