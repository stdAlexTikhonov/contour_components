import { connect } from "react-redux";
import { ViewComponent } from "./ViewComponent";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppActions } from "../../types/actions";
import { ThunkDispatch } from "redux-thunk";
import { setFilterOfView } from "../../actions/filters";
import { getFilters, getFullHierarchy } from "../../utils/api";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  filters: state.filters.filters,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  setCurrentFilters: (filters: any) => {
    getFilters().then((data) => dispatch(setFilterOfView(data)));
    getFullHierarchy().then((data) => console.log(data));
  },
});

export const View = connect(mapStateToProps, mapDispatchToProps)(ViewComponent);
