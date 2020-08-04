import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { ExportPDF } from "./ExportComponent";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const reportData = await getData(data_for_query);
    //if success and response have type property then we can save type
    if (reportData.success) {
    }
  },
});

export const Export = connect(mapStateToProps, mapDispatchToProps)(ExportPDF);
