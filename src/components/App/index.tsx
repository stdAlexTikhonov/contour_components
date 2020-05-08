import React, { useEffect } from "react";
import { ButtonAppBar } from "../Navabar";
import { connect } from "react-redux";
import { handleInitialData } from "../../actions/shared";
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
}) => {
  useEffect(() => {
    getInitialData();
  }, [getInitialData]);
  return (
    <div>
      {loading && <LoaderComponent />}
      <ButtonAppBar languages={languages} />
      {name + " " + process.env.REACT_APP_BI_URL}
    </div>
  );
};

interface LinkStateProps {
  loading: boolean;
  languages: { [index: string]: string };
}

interface LinkDispatchProps {
  getInitialData: () => void;
}

const mapStateToProps = (state: AppState, props: IProps): LinkStateProps => ({
  loading: state.loading,
  languages: state.languages,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  props: IProps
): LinkDispatchProps => ({
  getInitialData: bindActionCreators(handleInitialData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
