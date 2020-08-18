import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { UserLayoutsComponent } from "./UserLayoutsComponent";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { setLoading, resetLoading } from "../../actions/loading";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToProps => ({
  setLayout: async (data_for_query: DataForQuery) => {
    const printSettingsData = await getData(data_for_query);
    console.log(printSettingsData);
  },
});

export const UserLayouts = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLayoutsComponent);
