import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ButtonAppBar } from "../Navabar";
import { Login } from "../Login";
import { Cards } from "../Cards";
import { Report } from "../Report";
import { RegistrationForm } from "../Registration";
import { connect } from "react-redux";
import { handleInitialData } from "../../actions/shared";
import { setLoggedOut } from "../../actions/authedUser";
import { setLanguage } from "../../actions/languages";
import { LoaderComponent } from "../Loader/index";
import { AppState } from "../../store/config_store";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { bindActionCreators } from "redux";
import { removeSession, saveLanguage } from "../../utils/api";

interface IProps {}

export type Props = IProps & LinkStateProps & LinkDispatchProps;

export const App: React.FC<Props> = ({
  loading,
  getInitialData,
  languages,
  logged_in,
  changeLanguage,
  current,
  handleLogout,
}) => {
  useEffect(() => {
    getInitialData();
  }, [getInitialData]);
  return (
    <BrowserRouter>
      {loading && <LoaderComponent />}
      <ButtonAppBar
        languages={languages}
        logged_in={logged_in}
        changeLanguage={changeLanguage}
        currentLanguage={current}
        handleLogout={handleLogout}
      />
      <Switch>
        <Route path="/" exact component={Cards} />
        <Route path={"/login"} component={Login} />
        <Route path={"/register"} component={RegistrationForm} />
        <Route path={"/:solution/"} exact component={Cards} />
        <Route path={"/:solution/:folder"} exact component={Cards} />
        <Route path={"/:solution/project/:project"} exact component={Cards} />
        <Route
          path={"/:solution/project/:project/:p_folder"}
          exact
          component={Cards}
        />
        <Route
          path={"/:solution/project/:project/report/:report"}
          exact
          component={Report}
        />
      </Switch>
    </BrowserRouter>
  );
};

interface LinkStateProps {
  loading: boolean;
  languages: { [index: string]: string };
  logged_in: boolean;
  current: string;
}

interface LinkDispatchProps {
  getInitialData: () => void;
  changeLanguage: (lang: string) => AppActions;
  handleLogout: () => void;
}

const mapStateToProps = (state: AppState, props: IProps): LinkStateProps => ({
  loading: state.loading,
  languages: state.languages,
  logged_in: state.auth.logged_in,
  current: state.languages[state.languages.current],
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  props: IProps
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
