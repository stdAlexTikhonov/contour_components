import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { ReportComponent } from "./Report";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { DataForQuery } from "../../utils/types";
import { LAYOUTS, REPORT } from "../../utils/constants";
import { getData } from "../../utils/api";
import {
  setReportType,
  setTabItem,
  setTabs,
  setDashboard,
  setDashboardMetadata,
  setReportCaption,
  setReportStyle,
  getReportLayouts,
  setCurrentLayout,
} from "../../actions/report";
import { setBreadcrumbs } from "../../actions/breadcrumbs";
import { formatGeometry } from "../../utils/helpers";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  logged_in: state.auth.logged_in,
  session: state.auth.session || undefined,
  language: state.languages.current,
  report: state.report.code,
  report_type: state.report.report_type,
  tab_item: state.report.tab_item,
  tabs: state.report.tabs,
  metadata: state.report.metadata,
  dashboard: state.report.dashboard,
  report_caption: state.report.report_caption,
  report_stylesheet: state.report.stylesheet,
  project_stylesheet: state.project.stylesheet,
  layouts: state.report.layouts,
});

const mapDispatchToProps = (dispatch: any): LinkDispatchToProps => ({
  handleDataQuery: async (data_for_query: DataForQuery) => {
    const reportData = await getData(data_for_query);
    //if success and response have type property then we can save type
    if (reportData.success) {
      if (reportData.metadata) {
        const metadata = reportData.metadata.map((item: any) => ({
          caption: item.Caption,
          facts: item.Facts,
          filters: item.Dimensions.items.filter(
            (item: any) => item.Axis === "Filter"
          ),
          columns: item.Dimensions.items.filter(
            (item: any) => item.Axis === "Columns"
          ),
          rows: item.Dimensions.items.filter(
            (item: any) => item.Axis === "Rows"
          ),
          attributes: item.Dimensions.items.filter(
            (item: any) => item.Axis === "Attributes"
          ),
          visibleFacts: item.visibleFacts,
          multipleFacts: item.multipleFacts,
          filterDimensions: item.FilterDimensions?.items,
        }));
        dispatch(setDashboardMetadata(metadata));
      }
      reportData.type && dispatch(setReportType(reportData.type));

      //if we got dashboard prop then we can save data for dashboard
      reportData.dashboard &&
        dispatch(setDashboard(formatGeometry(reportData.dashboard)));

      //...
      reportData.tab_item && dispatch(setTabItem(reportData.tab_item));

      //set breadcrumbs
      reportData.path && dispatch(setBreadcrumbs(reportData.path));

      //if report_type !== dashboard in query then setTab
      reportData.items && dispatch(setTabs(reportData.items));

      //caption
      reportData.caption && dispatch(setReportCaption(reportData.caption));

      //style
      reportData.stylesheet && dispatch(setReportStyle(reportData.stylesheet));

      //layouts
      if (reportData.layouts) {
        dispatch(getReportLayouts(reportData.layouts));
        reportData.layouts.forEach((item: any) => {
          if (item.default) {
            dispatch(setCurrentLayout(item.code));
          }
        });
      }
    } else {
      console.log(`It was ${data_for_query.method}`);
      switch (data_for_query.method) {
        case LAYOUTS:
          dispatch(getReportLayouts([]));
          return;
      }
    }
  },
});

export const Report = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportComponent);
