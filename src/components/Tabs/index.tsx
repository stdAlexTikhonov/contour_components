import { TabsComponent } from "./TabsComponent";
import { connect } from "react-redux";
import { LinkStateToProps, LinkDispatchToProps } from "./types";
import { AppState } from "../../store/config_store";
import { DataForQuery } from "../../utils/types";
import { getData } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { setLoading, resetLoading } from "../../actions/loading";
import { setDataToTab } from "../../actions/report";
import { formatGeometry } from "../../utils/helpers";
import { DASH_VIEW_META } from "../../utils/constants";
import { REPORT } from "../../utils/constants";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  session: state.auth.session || undefined,
  language: state.languages.current,
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
      reportData.dashboard &&
        dispatch(
          setDataToTab(
            { dashboard: formatGeometry(reportData.dashboard) },
            index
          )
        );
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
        }));
        dispatch(setDataToTab({ metadata: metadata }, index));
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
      };
      dispatch(setDataToTab({ view: result }, index));
    }

    dispatch(resetLoading());
  },
});

export const Tabs = connect(mapStateToProps, mapDispatchToProps)(TabsComponent);
