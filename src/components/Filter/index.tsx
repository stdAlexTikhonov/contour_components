import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppState } from "../../store/config_store";
import { connect } from "react-redux";
import { AppActions } from "../../types/actions";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { getDimFilter } from "../../actions/report";
import { FilterComponent } from "./FilterComponent";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  selected_filter: state.report.selected_filter,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const data = await getData(data_for_query);

    const data_transformed = {
      captions: data.Captions,
      filters: data.Filters,
    };

    dispatch(getDimFilter(data_transformed));
  },
  resetSelectedFilter: () => {
    dispatch(getDimFilter(null));
  },
});

export const Filter = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterComponent);
