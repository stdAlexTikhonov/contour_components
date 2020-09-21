import {
  AppActions,
  SET_REPORT,
  SET_REPORT_TYPE,
  SET_TAB_ITEM,
  SET_TABS,
  SET_DASHBOARD,
  SET_DASHBOARD_METADATA,
  GET_DIMENSION_FILTER,
  SET_DATA_TO_TAB,
  SET_CUBE_SESSION,
  SET_REPORT_CAPTION,
  SET_REPORT_STYLE,
  SET_PRINT_PAGE_PROPS,
  GET_REPORT_LAYOUTS,
  RESET_REPORT,
  SET_CURRENT_LAYOUT,
  SET_LAYOUT_CUBE_SESSION,
  SET_SUBSCRIBTIONS,
  Dashboard,
  Metadata,
  DimFilter,
  Tab,
} from "../types/actions";
import { pringPage } from "../types/reducers";
import { Subscriptions } from "../components/Menu/Components/Subscriptions";

export const setReport = (report: string): AppActions => ({
  type: SET_REPORT,
  report,
});

export const setPrintPage = (print_page: pringPage): AppActions => ({
  type: SET_PRINT_PAGE_PROPS,
  print_page,
});

export const setReportStyle = (style: any): AppActions => ({
  type: SET_REPORT_STYLE,
  style,
});

export const setReportCaption = (report_caption: string): AppActions => ({
  type: SET_REPORT_CAPTION,
  report_caption,
});

export const setReportType = (type: string | null): AppActions => ({
  type: SET_REPORT_TYPE,
  report_type: type,
});

export const setTabItem = (tab_item: string | null): AppActions => ({
  type: SET_TAB_ITEM,
  tab_item,
});

export const setTabs = (tabs: Tab[] | null): AppActions => ({
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

export const getDimFilter = (
  selected_filter: DimFilter | null
): AppActions => ({
  type: GET_DIMENSION_FILTER,
  selected_filter,
});

export const setDataToTab = (data: any, index: number): AppActions => ({
  type: SET_DATA_TO_TAB,
  data,
  index,
});

export const setCubeSession = (
  cube_session: string | undefined
): AppActions => ({
  type: SET_CUBE_SESSION,
  cube_session,
});

export const getReportLayouts = (layouts: any): AppActions => ({
  type: GET_REPORT_LAYOUTS,
  layouts,
});

export const resetReport = (): AppActions => ({
  type: RESET_REPORT,
});

export const setCurrentLayout = (code: string): AppActions => ({
  type: SET_CURRENT_LAYOUT,
  code: code,
});

export const setLayoutCubeSession = (cubeSession: string): AppActions => ({
  type: SET_LAYOUT_CUBE_SESSION,
  cubeSession,
});

export const setSubscriptions = (subscribtions: any): AppActions => ({
  type: SET_SUBSCRIBTIONS,
  subscribtions,
});
