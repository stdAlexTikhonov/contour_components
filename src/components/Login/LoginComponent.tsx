import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { IProps } from "./types";

export const LoginComponent: React.FC<IProps> = ({
  handleLogin,
  logged_in,
}) => {
  const classes = useStyles();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={classes.container}>
      <form className={classes.root} noValidate={true} autoComplete="off">
        <TextField
          id="filled-basic"
          label="Login"
          variant="outlined"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          disabled={logged_in}
          onClick={() => handleLogin(login, password)}
        >
          Login
        </Button>
      </form>
    </div>
  );
};
