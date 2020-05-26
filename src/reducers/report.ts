import {
  SET_REPORT,
  SET_REPORT_TYPE,
  SET_TAB_ITEM,
  SET_TABS,
  SET_DASHBOARD,
  SET_DASHBOARD_METADATA,
  GET_DIMENSION_FILTER,
  SET_DATA_TO_TAB,
  reportActions,
  Tab,
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
      const new_tab: Tab = Object.assign(tab, { data: action.data });
      state.tabs!.splice(action.index, 1, new_tab);
      return {
        ...state,
        tabs: state.tabs,
      };
    }

    default:
      return state;
  }
};
