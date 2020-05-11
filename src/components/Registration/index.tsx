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
      height: "500px",
    },
  })
);

interface IProps {}

export type Props = IProps & LinkDispatchProps;

export const RegistrationFormComponent: React.FC<Props> = (props) => {
  const classes = useStyles();
  const refLogin = useRef<HTMLInputElement | undefined>();
  const refPassword = useRef<HTMLInputElement | undefined>();
  const refFirstname = useRef<HTMLInputElement | undefined>();
  const refSurname = useRef<HTMLInputElement | undefined>();
  const refEmail = useRef<HTMLInputElement | undefined>();

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
  );
};

interface LinkDispatchProps {
  handleRegister: (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined,
    firstname: HTMLInputElement | undefined,
    surname: HTMLInputElement | undefined,
    email: HTMLInputElement | undefined
  ) => void;
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  props: IProps
): LinkDispatchProps => ({
  handleRegister: (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined,
    firstname: HTMLInputElement | undefined,
    surname: HTMLInputElement | undefined,
    email: HTMLInputElement | undefined
  ) => {
    console.log(login?.value);
    console.log(password?.value);
    console.log(firstname?.value);
    console.log(surname?.value);
    console.log(email?.value);
  },
});

export const RegistrationForm = connect(
  null,
  mapDispatchToProps
)(RegistrationFormComponent);
