import {
  SET_REPORT,
  SET_REPORT_TYPE,
  SET_TAB_ITEM,
  SET_TABS,
  SET_DASHBOARD,
  SET_DASHBOARD_METADATA,
  SET_EXPANDED_FILTER,
  GET_DIMENSION_FILTER,
  SET_DATA_TO_TAB,
  SET_CUBE_SESSION,
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
  cube_session: undefined,
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
    case SET_EXPANDED_FILTER: {
      const view = state.metadata && state.metadata[action.index];
      view!.expandedFilter = action.expanded_filter;
      state.metadata!.splice(action.index, 1, view!);
      return {
        ...state,
        metadata: state.metadata,
      };
    }
    case SET_CUBE_SESSION:
      return {
        ...state,
        cube_session: action.cube_session,
      };
    default:
      return state;
  }
};
