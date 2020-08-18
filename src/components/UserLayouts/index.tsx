import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { UserLayoutsComponent } from "./UserLayoutsComponent";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { setLoading, resetLoading } from "../../actions/loading";
import { SAVE_USER_LAYOUT } from "../../utils/constants";
import { getReportLayouts } from "../../actions/report";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
  layouts: state.report.layouts,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToProps => ({
  setLayout: async (data_for_query: DataForQuery, layouts: any) => {
    const printSettingsData = await getData(data_for_query);
    if (
      printSettingsData.success &&
      data_for_query.method === SAVE_USER_LAYOUT
    ) {
      const newLayout = {
        caption: data_for_query.caption,
        code: printSettingsData.layout,
        default: false,
        user: true,
      };
      layouts.push(newLayout);
      dispatch(getReportLayouts(layouts));
    }
  },
});

export const UserLayouts = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLayoutsComponent);
