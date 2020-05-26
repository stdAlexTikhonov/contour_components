import { TabsComponent } from "./TabsComponent";
import { connect } from "react-redux";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppState } from "../../store/config_store";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { setLoading, resetLoading } from "../../actions/loading";
import { setDataToTab } from "../../actions/report";
import { setItems } from "../../actions/items";
import { setView } from "../../actions/view";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  tabs: state.report?.tabs,
  session: state.auth.session || undefined,
  language: state.languages.current,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery, index: number) => {
    dispatch(setLoading());
    const data = await getData(data_for_query);

    if (data.success) dispatch(setDataToTab(data, index));
    dispatch(resetLoading());
  },
});

export const Tabs = connect(mapStateToProps, mapDispatchToProps)(TabsComponent);
