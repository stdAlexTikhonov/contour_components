import React, { useRef } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles";
import { IProps } from "./types";

export const LoginComponent: React.FC<IProps> = ({
  handleLogin,
  logged_in,
}) => {
  const classes = useStyles();
  const refLogin = useRef<HTMLInputElement | undefined>();
  const refPassword = useRef<HTMLInputElement | undefined>();

  return (
    <div className={classes.container}>
      <form className={classes.root} noValidate={true} autoComplete="off">
        <TextField
          id="filled-basic"
          label="Login"
          variant="outlined"
          inputRef={refLogin}
        />

        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          inputRef={refPassword}
        />

        <Button
          variant="contained"
          style={{ backgroundColor: "#003366" }}
          color="primary"
          disabled={logged_in}
          onClick={() => handleLogin(refLogin.current, refPassword.current)}
        >
          Login
        </Button>
      </form>
    </div>
  );
};
