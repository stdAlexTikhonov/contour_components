import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { UserLayoutsComponent } from "./UserLayoutsComponent";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { SAVE_USER_LAYOUT, DELETE_USER_LAYOUT } from "../../utils/constants";
import {
  getReportLayouts,
  resetReport,
  setCurrentLayout,
} from "../../actions/report";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
  layouts: state.report.layouts,
  current_layout: state.report.current_layout,
  layout_cube_session: state.report.layout_cube_session,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToProps => ({
  setLayout: async (data_for_query: DataForQuery, layouts?: any) => {
    const layoutData = await getData(data_for_query);

    if (layoutData.success) {
      if (data_for_query.layout && data_for_query.method === SAVE_USER_LAYOUT) {
        //SAVE
        alert("Layout was saved!");
      } else if (data_for_query.method === SAVE_USER_LAYOUT) {
        //SAVE AS
        const newLayout = {
          caption: data_for_query.caption,
          code: layoutData.layout,
          default: false,
          user: true,
        };
        layouts.push(newLayout);
        dispatch(getReportLayouts(layouts));
        dispatch(setCurrentLayout(layoutData.layout));
      } else if (data_for_query.method === DELETE_USER_LAYOUT) {
        dispatch(getReportLayouts(layouts));
        alert("Layout was deleted!");
      }
    }
  },
  resetReport: () => {
    dispatch(resetReport());
  },
  setDefault: (layouts: any) => {
    dispatch(getReportLayouts(layouts));
    alert("Default layout was changed!");
  },
});

export const UserLayouts = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLayoutsComponent);
