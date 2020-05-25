import {
  AppActions,
  SET_REPORT,
  SET_REPORT_TYPE,
  SET_TAB_ITEM,
  SET_TABS,
  SET_DASHBOARD,
  SET_DASHBOARD_METADATA,
  GET_DIMENSION_FILTER,
  Dashboard,
  Metadata,
  DimFilter,
} from "../types/actions";

export const setReport = (report: string): AppActions => ({
  type: SET_REPORT,
  report,
});

export const setReportType = (type: string | null): AppActions => ({
  type: SET_REPORT_TYPE,
  report_type: type,
});

export const setTabItem = (tab_item: string | null): AppActions => ({
  type: SET_TAB_ITEM,
  tab_item,
});

export const setTabs = (tabs: [] | null): AppActions => ({
  type: SET_TABS,
  tabs,
});

export const setDashboard = (dashboard: Dashboard | null): AppActions => ({
  type: SET_DASHBOARD,
  dashboard,
});

export const setDashboardMetadata = (
  metadata: Array<Metadata> | null
): AppActions => ({
  type: SET_DASHBOARD_METADATA,
  metadata,
});

export const getDimFilter = (selected_filter: DimFilter): AppActions => ({
  type: GET_DIMENSION_FILTER,
  selected_filter,
});
