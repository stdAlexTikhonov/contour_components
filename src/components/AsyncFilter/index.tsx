import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppState } from "../../store/config_store";
import { connect } from "react-redux";
import { AppActions } from "../../types/actions";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { getDimFilter } from "../../actions/report";
import { AsyncFilterComponent } from "./AsyncFilterComponent";

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
      captions: data.Captions.map((item: string) =>
        item.replace(/&nbsp;/g, " ")
      ),
      filters: data.Filters,
      disabled: data.Hidden,
    };

    dispatch(getDimFilter(data_transformed));
    return data_transformed;
  },
  resetSelectedFilter: () => {
    dispatch(getDimFilter(null));
  },
});

export const AsyncFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(AsyncFilterComponent);
