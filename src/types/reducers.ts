import { Dashboard, Metadata, DimFilter, Tab } from "../types/actions";

export interface authedUserType {
  logged_in: boolean;
  session: string | null;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
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
  stylesheet: any;
  print_page: pringPage | null;
  layouts: any;
  current_layout: string | null;
  layout_cube_session: string | null;
};

type ItemHeaderFooter = {
  Text: string;
  Type: number;
};

export type pringPage = {
  BreakHeader: boolean;
  CaptionOnEachPage: boolean;
  FitToPage: number;
  FooterOnEachPage: boolean;
  GrayScale: boolean;
  HeaderFooterVisible: boolean;
  HeaderOnEachPage: boolean;
  HorizontalScaleVisible: boolean;
  Margins: number[];
  Portrait: boolean;
  VerticalScaleVisible: boolean;
  ScaleHeaderFooter?: boolean;
  HeaderFooter: ItemHeaderFooter[];
};

export type AppReducers = authedUserType | languageType;
