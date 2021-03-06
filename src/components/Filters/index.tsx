import { connect } from "react-redux";
import { FiltersComponent } from "./FiltersComponent";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppState } from "../../store/config_store";
import { AppActions } from "../../types/actions";
import { ThunkDispatch } from "redux-thunk";
import { setCubeSessionId } from "../../actions/cubes";
import { setCheckedItems } from "../../actions/filters";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  cubes: state.cubes,
  selected_filter: state.filters.selected_filter,
  expanded: state.filters.expanded,
  filter_items: state.filters.items,
  checked: state.filters.checked,
  multiple: state.filters.multiple,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  settingCubeSession: (cube_id: string, cube_session: string) => {
    dispatch(setCubeSessionId(cube_id, cube_session));
  },
  settingCheckedItems: (checked: any) => {
    dispatch(setCheckedItems(checked));
  },
});

export const Filters = connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersComponent);
