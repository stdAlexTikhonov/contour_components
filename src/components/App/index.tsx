import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ButtonAppBar } from "../Navabar";
import { Login } from "../Login";
import { connect } from "react-redux";
import { handleInitialData } from "../../actions/shared";
import { setLanguage } from "../../actions/languages";
import { LoaderComponent } from "../Loader/index";
import { AppState } from "../../store/config_store";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { bindActionCreators } from "redux";

interface IProps {}

export type Props = IProps & LinkStateProps & LinkDispatchProps;

export const App: React.FC<Props> = ({
  loading,
  getInitialData,
  languages,
  logged_in,
  changeLanguage,
  current,
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
      />
      <Switch>
        <Route path={"/login"} component={Login} />
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
  changeLanguage: (lang: string) => dispatch(setLanguage(lang)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
