import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { DataForQuery } from "../../utils/types";
import { checkOLAP } from "../../utils/helpers";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { setLoading, resetLoading } from "../../actions/loading";
import { SubscriptionsComponent } from "./SubscriptionsComponent";
import {
  setSubscribtions,
  setListOfViews,
  setSelectedSubscription,
} from "../../actions/report";
import { LinkDispatchToProps, LinkStateToProps } from "./types";
import { SUBSCRIPTION_REMOVE } from "../../utils/constants";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  selected_subscription: state.report.selected_subscription,
  subscriptions: state.report.subscribtions,
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    dispatch(setLoading());
    const data = await getData(data_for_query);

    if (data.success) {
      data.subsctiptions && dispatch(setSubscribtions(data.subsctiptions));
      if (data_for_query.method === SUBSCRIPTION_REMOVE)
        dispatch(setSelectedSubscription(null));
    }
    dispatch(resetLoading());
  },
  selectSubscription: (code: string) => {
    dispatch(setSelectedSubscription(code));
  },
});

export const Subscriptions = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionsComponent);
