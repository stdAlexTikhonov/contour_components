import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { ReportComponent } from "./Report";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { setReportType } from "../../actions/report";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
  report_type: state.report.report_type,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const reportData = await getData(data_for_query);
    if (reportData.success && reportData.type)
      dispatch(setReportType(reportData.type));
    console.log(reportData);
  },
});

export const Report = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportComponent);
