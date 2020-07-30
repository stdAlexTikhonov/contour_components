import { connect } from "react-redux";
import { ViewComponent } from "./ViewComponent";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppActions } from "../../types/actions";
import { ThunkDispatch } from "redux-thunk";
import { setFilterOfView, setFullFilterHierarchy } from "../../actions/filters";
import { getFilters, getFullHierarchy } from "../../utils/api";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  filters: state.filters.filters,
  hierarchy: state.filters.hierarchy,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  setCurrentFilters: (filters: any, hierarchy: any) => {
    dispatch(setFilterOfView(filters));
    // getFullHierarchy().then((data) => dispatch(setFullFilterHierarchy(data)));
  },
});

export const View = connect(mapStateToProps, mapDispatchToProps)(ViewComponent);
