import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { ExportPDF } from "./ExportComponent";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { setPrintPage } from "../../actions/report";
import { EXPORT, PRINT_PAGE_SETUP } from "../../utils/constants";
import { setLoading, resetLoading } from "../../actions/loading";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
  print_page: state.report.print_page,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    dispatch(setLoading());
    const printSettingsData = await getData(data_for_query);
    //if success and response have type property then we can save type
    if (printSettingsData.success) {
      data_for_query.method === PRINT_PAGE_SETUP &&
        dispatch(setPrintPage(printSettingsData.pageSetup));

      if (data_for_query.method === EXPORT) {
        dispatch(resetLoading());
        return printSettingsData.export;
      }
    }
    dispatch(resetLoading());
  },
});

export const Export = connect(mapStateToProps, mapDispatchToProps)(ExportPDF);
