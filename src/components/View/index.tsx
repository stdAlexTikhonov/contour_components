import { connect } from "react-redux";
import { ViewComponent } from "./ViewComponent";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppActions } from "../../types/actions";
import { ThunkDispatch } from "redux-thunk";
import { setFilterOfView } from "../../actions/filters";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  setCurrentFilters: (filters: any) => {
    dispatch(setFilterOfView(filters));
  },
});

export const View = connect(mapStateToProps, mapDispatchToProps)(ViewComponent);
