import { AppActions, SET_REPORT, SET_REPORT_TYPE } from "../types/actions";

export const setReport = (report: string): AppActions => ({
  type: SET_REPORT,
  report,
});

export const setReportType = (type: string | null): AppActions => ({
  type: SET_REPORT_TYPE,
  report_type: type,
});
