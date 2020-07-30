import { FieldBarComponent } from "./FieldBar";
import { connect } from "react-redux";
import { AppState } from "../../store/config_store";

import { AppActions } from "../../types/actions";
import { DataForQuery } from "../../utils/types";
import { setCubeSession } from "../../actions/report";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { START_CUBE_SESSION } from "../../utils/constants";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  cube_session: state.report.cube_session,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const data = await getData(data_for_query);
    if (data.success) dispatch(setCubeSession(data.cubeSession));
  },
});

export const FieldBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FieldBarComponent);
