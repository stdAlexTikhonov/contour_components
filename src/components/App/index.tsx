import { connect } from "react-redux";
import { handleInitialData } from "../../actions/shared";
import { setLoggedOut } from "../../actions/authedUser";
import { setLanguage } from "../../actions/languages";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { bindActionCreators } from "redux";
import { removeSession, saveLanguage } from "../../utils/api";
import { AppComponent } from "./App";
import { AppState } from "../../store/config_store";
import { LinkDispatchProps, LinkStateProps } from "./types";

const mapStateToProps = (state: AppState): LinkStateProps => ({
  loading: state.loading,
  languages: state.languages,
  logged_in: state.auth.logged_in,
  current: state.languages[state.languages.current],
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
  getInitialData: bindActionCreators(handleInitialData, dispatch),
  changeLanguage: (lang: string) => {
    saveLanguage(lang);
    return dispatch(setLanguage(lang));
  },
  handleLogout: () => {
    removeSession();
    dispatch(setLoggedOut());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
