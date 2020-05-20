import { SET_REPORT, setReport } from "../types/actions";

export const report = (state = false, action: setReport) => {
  switch (action.type) {
    case SET_REPORT:
      return action.report;
    default:
      return state;
  }
};
