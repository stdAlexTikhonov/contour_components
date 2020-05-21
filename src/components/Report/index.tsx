import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { ReportComponent } from "./Report";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import {
  setReportType,
  setTabItem,
  setTabs,
  setDashboard,
} from "../../actions/report";
import { formatGeometry } from "../../utils/helpers";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
  report_type: state.report.report_type,
  tab_item: state.report.tab_item,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const reportData = await getData(data_for_query);

    if (reportData.success && reportData.type) {
      dispatch(setReportType(reportData.type));
      reportData.dashboard &&
        dispatch(setDashboard(formatGeometry(reportData.dashboard)));
      reportData.tab_item && dispatch(setTabItem(reportData.tab_item));
    }

    reportData.type && console.log(reportData);
    data_for_query.type && dispatch(setTabs(reportData.items));
  },
});

export const Report = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportComponent);
