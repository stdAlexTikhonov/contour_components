import {
  SET_REPORT,
  SET_REPORT_TYPE,
  SET_TAB_ITEM,
  SET_TABS,
  SET_DASHBOARD,
  reportActions,
} from "../types/actions";
import { reportType } from "../types/reducers";

const reportDefaultState: reportType = {
  code: null,
  report_type: null,
  tab_item: null,
  tabs: null,
  dashboard: null,
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
    default:
      return state;
  }
};
