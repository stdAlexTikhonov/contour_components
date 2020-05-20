import { AppActions, SET_REPORT } from "../types/actions";

export const setReport = (report: string): AppActions => ({
  type: SET_REPORT,
  report,
});
