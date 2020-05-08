import React, { useEffect } from "react";
import { ButtonAppBar } from "../Navabar";
import { connect } from "react-redux";
import { handleInitialData } from "../../actions/shared";
import { setLanguage } from "../../actions/languages";
import { LoaderComponent } from "../Loader/index";
import { AppState } from "../../store/config_store";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { bindActionCreators } from "redux";

interface IProps {
  name: string;
}

export type Props = IProps & LinkStateProps & LinkDispatchProps;

export const App: React.FC<Props> = ({
  loading,
  getInitialData,
  name,
  languages,
  logged_in,
  changeLanguage,
  current,
}) => {
  useEffect(() => {
    getInitialData();
  }, [getInitialData]);
  return (
    <div>
      {loading && <LoaderComponent />}
      <ButtonAppBar
        languages={languages}
        logged_in={logged_in}
        changeLanguage={changeLanguage}
        currentLanguage={current}
      />
      {name + " " + process.env.REACT_APP_BI_URL}
    </div>
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
