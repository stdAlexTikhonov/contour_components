import React, { useRef } from "react";
import { connect } from "react-redux";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";

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
      height: "300px",
    },
  })
);

interface IProps {}

export type Props = IProps & LinkDispatchProps;

export const LoginComponent: React.FC<Props> = (props) => {
  const classes = useStyles();
  const refLogin = useRef<HTMLInputElement | undefined>();
  const refPassword = useRef<HTMLInputElement | undefined>();

  return (
    <div className={classes.container}>
      <form className={classes.root} noValidate autoComplete="off">
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
          color="primary"
          onClick={() =>
            props.handleLogin(refLogin.current, refPassword.current)
          }
        >
          Login
        </Button>
      </form>
    </div>
  );
};

interface LinkDispatchProps {
  handleLogin: (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined
  ) => void;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  props: IProps
): LinkDispatchProps => ({
  handleLogin: (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined
  ) => {
    console.log(login?.value);
    console.log(password?.value);
  },
});

export const Login = connect(null, mapDispatchToProps)(LoginComponent);
