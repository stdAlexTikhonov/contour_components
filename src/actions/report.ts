import {
  AppActions,
  SET_REPORT,
  SET_REPORT_TYPE,
  SET_TAB_ITEM,
  SET_TABS,
  SET_DASHBOARD,
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

export const setDashboard = (dashboard: object | null): AppActions => ({
  type: SET_DASHBOARD,
  dashboard,
});
