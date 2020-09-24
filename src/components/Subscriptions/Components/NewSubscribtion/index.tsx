import { connect } from "react-redux";
import { AppState } from "../../../../store/config_store";
import { DataForQuery } from "../../../../utils/types";
import { getData } from "../../../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../../../types/actions";
import { setLoading, resetLoading } from "../../../../actions/loading";
import { NewSubscriptionComponent } from "./NewSubscriptionComponent";
// import { setSubscribtions, setListOfViews } from "../../actions/report";
import { LinkDispatchToProps, LinkStateToProps } from "./types";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
  list_of_views: state.report.list_of_views,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    dispatch(setLoading());
    const data = await getData(data_for_query);

    if (data.success) {
      console.log(data);
    }
    dispatch(resetLoading());
  },
});

export const NewSubscription = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewSubscriptionComponent);
