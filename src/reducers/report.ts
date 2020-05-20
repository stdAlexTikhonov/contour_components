import { SET_REPORT, SET_REPORT_TYPE, reportActions } from "../types/actions";
import { reportType } from "../types/reducers";

const reportDefaultState: reportType = {
  code: null,
  report_type: null,
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
    default:
      return state;
  }
};
