import React, { useState } from "react";
import { useStyles } from "./styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { IProps } from "./types";

export const RegistrationFormComponent: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className={classes.container}>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="filled-basic"
          label="Login"
          variant="outlined"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          id="outlined-basic-1"
          label="Firstname"
          variant="outlined"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <TextField
          id="outlined-basic-2"
          label="Surname"
          variant="outlined"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <TextField
          id="outlined-basic-3"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            props.handleRegister(login, password, firstname, surname, email)
          }
        >
          Register
        </Button>
      </form>
    </div>
  );
};
