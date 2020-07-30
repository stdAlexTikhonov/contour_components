import { Dashboard, Metadata, DimFilter, Tab } from "../types/actions";

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
  tabs: Tab[] | null;
  dashboard: Dashboard | null;
  metadata: Array<Metadata> | null;
  selected_filter: DimFilter | null;
  cube_session: string | undefined;
  report_caption: string;
};

export type AppReducers = authedUserType | languageType;
