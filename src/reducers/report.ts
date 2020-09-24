import {
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
  SET_LIST_OF_VIEWS,
  RESET_REPORT,
  reportActions,
  SET_CURRENT_LAYOUT,
  SET_SUBSCRIBTIONS,
  SET_SELECTED_SUBSCRIPTION,
} from "../types/actions";
import { reportType } from "../types/reducers";

const reportDefaultState: reportType = {
  code: null,
  report_type: null,
  tab_item: null,
  tabs: null,
  dashboard: null,
  metadata: null,
  selected_filter: null,
  cube_session: undefined,
  report_caption: "",
  stylesheet: null,
  print_page: null,
  layouts: null,
  current_layout: null,
  layout_cube_session: null,
  subscribtions: null,
  list_of_views: null,
  selected_subscription: null,
};

export const report = (state = reportDefaultState, action: reportActions) => {
  switch (action.type) {
    case SET_REPORT:
      return {
        ...state,
        code: action.report,
      };
    case SET_REPORT_TYPE:
      return {
        ...state,
        report_type: action.report_type,
      };
    case SET_TAB_ITEM:
      return {
        ...state,
        tab_item: action.tab_item,
      };
    case SET_TABS:
      return {
        ...state,
        tabs: action.tabs,
      };
    case SET_DASHBOARD:
      return {
        ...state,
        dashboard: action.dashboard,
      };
    case SET_DASHBOARD_METADATA:
      return {
        ...state,
        metadata: action.metadata,
      };
    case GET_DIMENSION_FILTER:
      return {
        ...state,
        selected_filter: action.selected_filter,
      };
    case SET_DATA_TO_TAB: {
      const tab = state.tabs && state.tabs[action.index];
      const data = tab?.data ? tab?.data : {};
      const new_data = Object.assign(data, { ...action.data });
      const new_tab = Object.assign(tab, { data: new_data });
      state.tabs!.splice(action.index, 1, new_tab);
      return {
        ...state,
        tabs: state.tabs,
      };
    }
    case SET_CUBE_SESSION:
      return {
        ...state,
        cube_session: action.cube_session,
      };
    case SET_REPORT_CAPTION:
      return {
        ...state,
        report_caption: action.report_caption,
      };
    case SET_REPORT_STYLE:
      return {
        ...state,
        stylesheet: action.style,
      };
    case SET_PRINT_PAGE_PROPS:
      return {
        ...state,
        print_page: action.print_page,
      };
    case GET_REPORT_LAYOUTS:
      return {
        ...state,
        layouts: action.layouts,
      };
    case SET_CURRENT_LAYOUT:
      return {
        ...state,
        current_layout: action.code,
      };
    case RESET_REPORT:
      return {
        ...reportDefaultState,
      };
    case SET_SUBSCRIBTIONS:
      return {
        ...state,
        subscribtions: action.subscribtions,
      };
    case SET_LIST_OF_VIEWS:
      return {
        ...state,
        list_of_views: action.list_of_views,
      };
    case SET_SELECTED_SUBSCRIPTION:
      return {
        ...state,
        selected_subscription: action.code,
      };
    default:
      return state;
  }
};
