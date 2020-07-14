import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { CustomDropdownComponent } from "./CustomDropdownComponent";
import { setCubeSessionId } from "../../actions/cubes";
import { setExpandedFilter } from "../../actions/report";
import { setSelectedFilter } from "../../actions/filters";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  cube_session: state.report.cube_session,
  cubes: state.cubes,
  selected_filter: state.filters.selected_filter,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  settingCubeSession: (cube_id: string, cube_session: string) => {
    dispatch(setCubeSessionId(cube_id, cube_session));
  },
  settingExpandedFilter: (
    expanded_filter: any,
    index: number,
    filter_index: number
  ) => {
    dispatch(setExpandedFilter(expanded_filter, index, filter_index));
  },
  settingSelectedFilter: (index: number) => {
    dispatch(setSelectedFilter(index));
  },
});

export const CustomDropdown = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomDropdownComponent);
