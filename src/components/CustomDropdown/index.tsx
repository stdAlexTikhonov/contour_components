import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { CustomDropdownComponent } from "./CustomDropdownComponent";
import { setCubeSession } from "../../actions/report";
import { setCubeSessionId } from "../../actions/cubes";

import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  cube_session: state.report.cube_session,
  cubes: state.cubes,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  settingCubeSession: (cube_id: string, cube_session: string) => {
    dispatch(setCubeSessionId(cube_id, cube_session));
  },
});

export const CustomDropdown = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomDropdownComponent);
