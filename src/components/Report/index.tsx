import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { ReportComponent } from "./Report";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report,
});

const mapDispatchToProps = (): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const data = await getData(data_for_query);
    console.log(data);
  },
});

export const Report = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportComponent);
