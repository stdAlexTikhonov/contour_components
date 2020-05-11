import React, { useRef } from "react";
import { connect } from "react-redux";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { userLogin, saveSession } from "../../utils/api";
import { setLoggedIn, setAuthedUser } from "../../actions/authedUser";
import { AppState } from "../../store/config_store";

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

export type Props = IProps & LinkDispatchProps & LinkStateToProps;

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
          disabled={props.logged_in}
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

interface LinkStateToProps {
  logged_in: boolean;
}

interface LinkDispatchProps {
  handleLogin: (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined
  ) => void;
}

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  logged_in: state.auth.logged_in,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  props: IProps
): LinkDispatchProps => ({
  handleLogin: async (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined
  ) => {
    const data = await userLogin({
      user: login?.value || "guest",
      password: password?.value || "guest",
    });

    if (data.success) {
      dispatch(setLoggedIn());
      dispatch(setAuthedUser(data.session));
      saveSession(data.session);
    }
  },
});

export const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);
