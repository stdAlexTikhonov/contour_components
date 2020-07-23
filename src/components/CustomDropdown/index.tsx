import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { CustomDropdownComponent } from "./CustomDropdownComponent";
import { setCubeSessionId } from "../../actions/cubes";
import { setFullFilterHierarchy } from "../../actions/filters";
import {
  setSelectedFilter,
  setFilterState,
  setFilterItems,
  setCheckedItems,
  setMultipleValues,
} from "../../actions/filters";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  cube_session: state.report.cube_session,
  cubes: state.cubes,
  selected_filter: state.filters.selected_filter,
  expanded: state.filters.expanded,
  checked: state.filters.checked,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  settingCubeSession: (cube_id: string, cube_session: string) => {
    dispatch(setCubeSessionId(cube_id, cube_session));
  },
  settingSelectedFilter: (index: number) => {
    dispatch(setSelectedFilter(index));
  },
  settingFilterState: (expanded: boolean) => {
    dispatch(setFilterState(expanded));
  },
  settingFilterItems: (items: any[]) => {
    dispatch(setFilterItems(items));
  },
  settingCheckedItems: (checked: any) => {
    dispatch(setCheckedItems(checked));
  },
  settingMultipleValues: (multiple: boolean) => {
    dispatch(setMultipleValues(multiple));
  },
  settingFilterHierarchy: (data: any) => {
    dispatch(setFullFilterHierarchy(data));
  },
});

export const CustomDropdown = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomDropdownComponent);
