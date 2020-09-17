import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { userLogin, saveSession } from "../../utils/api";
import {
  setLoggedIn,
  setAuthedUser,
  setUserName,
} from "../../actions/authedUser";
import { AppState } from "../../store/config_store";
import { handleInitialData } from "../../actions/shared";
import { LinkDispatchProps, LinkStateToProps } from "./types";
import { LoginComponent } from "./LoginComponent";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  logged_in: state.auth.logged_in,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
  handleLogin: async (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined
  ) => {
    const data = await userLogin({
      user: login?.value!,
      password: password?.value!,
    });

    if (data.success) {
      dispatch(setUserName(data.user.metadata.fullname));
      dispatch(setLoggedIn());
      dispatch(setAuthedUser(data.session));
      saveSession(data.session);
      dispatch(handleInitialData());
    }
  },
});

export const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);
