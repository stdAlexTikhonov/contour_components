import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../../../types/actions";
import { userLogin, saveSession } from "../../../../utils/api";
import {
  setLoggedIn,
  setAuthedUser,
  setUserName,
} from "../../../../actions/authedUser";
import { AppState } from "../../../../store/config_store";
import { handleInitialData } from "../../../../actions/shared";
import { LinkDispatchProps, LinkStateToProps } from "./types";
import { ProfileComponent } from "./ProfileComponent";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  logged_in: state.auth.logged_in,
  name: state.auth.name,
  first_name: state.auth.first_name,
  email: state.auth.email,
  last_name: state.auth.last_name,
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
      const { firstname, secondname, email, fullname } = data.user.metadata;
      dispatch(setLoggedIn());
      dispatch(setAuthedUser(data.session));
      saveSession({
        session: data.session,
        name: fullname,
        first_name: firstname,
        last_name: secondname,
        email: email,
      });
      dispatch(handleInitialData());
    }
  },
});

export const Profile = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileComponent);
