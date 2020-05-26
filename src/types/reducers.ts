import { Dashboard, Metadata, DimFilter } from "../types/actions";

export interface authedUserType {
  logged_in: boolean;
  session: string | null;
}

export interface languageType {
  current: string;
  [index: string]: string;
}

export type reportType = {
  code: string | null;
  report_type: string | null;
  tab_item: string | null;
  tabs: [] | null;
  dashboard: Dashboard | null;
  metadata: Array<Metadata> | null;
  selected_filter: DimFilter | null;
};

export type AppReducers = authedUserType | languageType;
