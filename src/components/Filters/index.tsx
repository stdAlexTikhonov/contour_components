import { connect } from "react-redux";
import { FiltersComponent } from "./FiltersComponent";
import { LinkStateToProps } from "./types";
import { AppState } from "../../store/config_store";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  cube_session: state.report.cube_session,
  filter_index: (index: number) => state!.report!.metadata![index].filterIndex,
  filter_expanded: (index: number) =>
    state!.report!.metadata![index].expandedFilter,
});

export const Filters = connect(mapStateToProps)(FiltersComponent);
