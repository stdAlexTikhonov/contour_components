import { TabsComponent } from "./TabsComponent";
import { connect } from "react-redux";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppState } from "../../store/config_store";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { setLoading, resetLoading } from "../../actions/loading";
import {
  setDataToTab,
  setListOfViews,
  setDashboard,
  setDashboardMetadata,
} from "../../actions/report";
import { formatGeometry, checkOLAP } from "../../utils/helpers";
import { DASH_VIEW_META, ITEMS, REPORT } from "../../utils/constants";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
  metadata: state.report.metadata,
  dashboard: state.report.dashboard,
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
      if (reportData.dashboard) {
        const dashboard = formatGeometry(reportData.dashboard);
        dispatch(setDataToTab({ dashboard: dashboard }, index));
        dispatch(setDashboard(dashboard));
      }
    }

    if (reportData.items) {
      reportData.items.forEach(
        (item: any) => (item.report = data_for_query.report)
      );
      dispatch(setDataToTab({ tabs: reportData.items }, index));
    }

    if (reportData.dashboard) {
      data_for_query.method = DASH_VIEW_META;
      const dash_meta = await getData(data_for_query);
      if (dash_meta.success) {
        const metadata = dash_meta.metadata.map((item: any) => ({
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
          header: item.Header.html || null,
          footer: item.Footer.html || null,
        }));
        dispatch(setDataToTab({ metadata: metadata }, index));
        dispatch(setDashboardMetadata(metadata));
      }
    }

    if (reportData.view) {
      const item = reportData.view;

      const result = {
        caption: item.Caption,
        facts: item.Facts,
        filters: item.Dimensions.items.filter(
          (item: any) => item.Axis === "Filter"
        ),
        columns: item.Dimensions.items.filter(
          (item: any) => item.Axis === "Columns"
        ),
        rows: item.Dimensions.items.filter((item: any) => item.Axis === "Rows"),
        attributes: item.Dimensions.items.filter(
          (item: any) => item.Axis === "Attributes"
        ),
        visibleFacts: item.visibleFacts,
        multipleFacts: item.multipleFacts,
        filterDimensions: item.FilterDimensions?.items,
        header: item.Header.html || null,
        footer: item.Footer.html || null,
      };
      dispatch(setDataToTab({ view: result }, index));
      console.log(result);
      dispatch(setDashboardMetadata([result]));
    }

    dispatch(resetLoading());
  },
  handleListOfViews: (list_of_views: any) => {
    dispatch(setListOfViews(list_of_views));
  },
  resetDashboard: () => {
    dispatch(setDashboardMetadata(null));
    dispatch(setDashboard(null));
  },
});

export const Tabs = connect(mapStateToProps, mapDispatchToProps)(TabsComponent);
