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
import { formatGeometry } from "../../utils/helpers";

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
    const reportData = await getData(data_for_query);

    if (reportData.success) {
      reportData.type &&
        dispatch(setDataToTab({ report_type: reportData.type }, index));

      //if we got dashboard prop then we can save data for dashboard
      reportData.dashboard &&
        dispatch(
          setDataToTab(
            { dashboard: formatGeometry(reportData.dashboard) },
            index
          )
        );
    }
    dispatch(resetLoading());
  },
});

export const Tabs = connect(mapStateToProps, mapDispatchToProps)(TabsComponent);
