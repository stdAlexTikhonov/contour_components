import { pringPage } from "./reducers";

//User actions
export const SET_AUTHED_USER = "SET_AUTHED_USER";
export const SET_LOGGED_IN = "SET_LOGGED_IN";
export const SET_LOGGED_OUT = "SET_LOGGED_OUT";
export const SET_USER_NAME = "SET_USER_NAME";

export interface setAuthedUser {
  type: typeof SET_AUTHED_USER;
  id: string;
}

export interface setLoggedIn {
  type: typeof SET_LOGGED_IN;
}

export interface setLoggedOut {
  type: typeof SET_LOGGED_OUT;
}

export interface setUserName {
  type: typeof SET_USER_NAME;
  name: string;
  last_name: string;
  first_name: string;
  email: string;
}

export type authedUserActionTypes =
  | setAuthedUser
  | setLoggedIn
  | setLoggedOut
  | setUserName;

//Breadcrumbs actions
export const SET_BREADCRUMBS = "SET_BREADCRUMBS";

export interface setBreadcrumbs {
  type: typeof SET_BREADCRUMBS;
  breadcrumbs: Array<Breadcrumb>;
}

export type Breadcrumb = {
  caption: string;
  code: string;
  type: string;
  url_code: string;
};

//Charts actions
export const SET_CHARTS_DATA = "SET_CHARTS_DATA";
export const RESET_CHARTS_DATA = "RESET_CHARTS_DATA";

export interface setChartsData {
  type: typeof SET_CHARTS_DATA;
  payload: any;
}

export interface resetChartsData {
  type: typeof RESET_CHARTS_DATA;
}

//Language actions
export const SET_LANGUAGE = "SET_LANGUAGE";
export const SET_LANGUAGES = "GET_LANGUAGES";

export interface setLanguage {
  type: typeof SET_LANGUAGE;
  language: string;
}

export interface setLanguages {
  type: typeof SET_LANGUAGES;
  languages: { [index: string]: string };
}

export type languageActionTypes = setLanguages | setLanguage;

//Loading actions
export const SET_LOADING = "SET_LOADING";
export const RESET_LOADING = "RESET_LOADING";

export interface setLoading {
  type: typeof SET_LOADING;
}

export interface resetLoading {
  type: typeof RESET_LOADING;
}

export type loadingActionTypes = setLoading | resetLoading;

//Navigation actions
export const SET_SOLUTION = "SET_SOLUTION";
export const SET_SOLUTION_FOLDER = "SET_SOLUTION_FOLDER";
export const SET_PROJECT = "SET_PROJECT";
export const SET_UID = "SET_UID";
export const SET_UTID = "SET_UTID";

export interface setProject {
  type: typeof SET_PROJECT;
  code: string;
}

export interface setSolutionFolder {
  type: typeof SET_SOLUTION_FOLDER;
  code: string;
}

export interface setSolution {
  type: typeof SET_SOLUTION;
  code: string;
}

export interface setUniqueID {
  type: typeof SET_UID;
  id: string;
}

export interface setUniqueTreeID {
  type: typeof SET_UTID;
  id: string;
}

//Screen actions
export const SAVE_SCREEN = "SAVE_SCREEN";
export const TOGGLE_FOLDER = "TOGGLE_FOLDER";
export const SET_ACTIVE_TAB = "SET_ACTIVE_TAB";

export interface saveScreen {
  type: typeof SAVE_SCREEN;
  payload: any;
}

export interface toggleFolder {
  type: typeof TOGGLE_FOLDER;
  id: string;
}

export interface setActiveTab {
  type: typeof SET_ACTIVE_TAB;
  id: string;
  index: number;
}

//View
export const SET_VIEW = "SET_VIEW";

export interface setView {
  type: typeof SET_VIEW;
  view: string;
}

//cubes
export const SET_CUBE_SESSION_ID = "SET_CUBE_SESSION_ID";

export interface setCubeSessionId {
  type: typeof SET_CUBE_SESSION_ID;
  cube_id: string;
  cube_session: string;
}

//project
export const SET_PROJECT_STYLESHEET = "SET_PROJECT_STYLESHEET";

export interface setProjectStylesheet {
  type: typeof SET_PROJECT_STYLESHEET;
  stylesheet: any;
}

//printPage
export const SET_PRINT_PAGE_PROPS = "SET_PRINT_PAGE_PROPS";

export interface setPrintPageProps {
  type: typeof SET_PRINT_PAGE_PROPS;
  print_page: pringPage;
}

//report
export const SET_REPORT = "SET_REPORT";

export interface setReport {
  type: typeof SET_REPORT;
  report: string;
}

export const SET_REPORT_TYPE = "SET_REPORT_TYPE";

export interface setReportType {
  type: typeof SET_REPORT_TYPE;
  report_type: string | null;
}

export const SET_REPORT_CAPTION = "SET_REPORT_CAPTION";

export interface setReportCaption {
  type: typeof SET_REPORT_CAPTION;
  report_caption: string;
}

export const SET_REPORT_STYLE = "SET_REPORT_STYLE";

export interface setReportStyle {
  type: typeof SET_REPORT_STYLE;
  style: any;
}

export const SET_TAB_ITEM = "SET_TAB_ITEM";

export interface setTabItem {
  type: typeof SET_TAB_ITEM;
  tab_item: string | null;
}

export const SET_TABS = "SET_TABS";

export type Tab = {
  [index: string]: any;
};

export interface setTabs {
  type: typeof SET_TABS;
  tabs: Tab[] | null;
}

export const SET_DATA_TO_TAB = "SET_DATA_TO_TAB";

export interface setDataToTab {
  type: typeof SET_DATA_TO_TAB;
  data: any;
  index: number;
}

export const SET_DASHBOARD = "SET_DASHBOARD";

export type Dashboard = {
  cells: any;
  grid: any;
};

export interface setDashboard {
  type: typeof SET_DASHBOARD;
  dashboard: Dashboard | null;
}

export const SET_DASHBOARD_METADATA = "SET_DASHBOARD_METADATA";

export type Metadata = {
  caption: string;
  facts: any;
  slice: string;
  view: string;
  id: string;
  filters: any;
  rows: any;
  columns: any;
  attributes: any;
  visibleFacts: any;
  report?: string;
  multipleFacts: boolean;
  filterDimensions: any;
  expandedFilter: any;
  filterIndex: number;
  viewType: string;
  footer: null | string;
  header: null | string;
};

export interface setDashboardMetadata {
  type: typeof SET_DASHBOARD_METADATA;
  metadata: Array<Metadata> | null;
}

export const GET_DIMENSION_FILTER = "GET_DIMETION_FILTER";

export type DimFilter = {
  captions: Array<string>;
  filters: string;
};

export interface getDimFilter {
  type: typeof GET_DIMENSION_FILTER;
  selected_filter: DimFilter | null;
}

export const SET_CUBE_SESSION = "SET_CUBE_SESSION";

export interface setCubeSession {
  type: typeof SET_CUBE_SESSION;
  cube_session: string | undefined;
}

export const GET_REPORT_LAYOUTS = "GET_REPORT_LAYOUTS";

export interface getReportLayouts {
  type: typeof GET_REPORT_LAYOUTS;
  layouts: any;
}

export const RESET_REPORT = "RESET_REPORT";

export interface resetReport {
  type: typeof RESET_REPORT;
}

export const SET_CURRENT_LAYOUT = "SET_CURRENT_LAYOUT";

export interface setCurrentLayout {
  type: typeof SET_CURRENT_LAYOUT;
  code: string;
}

export const SET_LAYOUT_CUBE_SESSION = "SET_LAYOUT_CUBE_SESSION";

export interface setLayoutCubeSession {
  type: typeof SET_LAYOUT_CUBE_SESSION;
  cubeSession: string;
}

// BreakHeader: boolean;
// CaptionOnEachPage: boolean;
// FitToPage: number;
// FooterOnEachPage: boolean;
// GrayScale: boolean;
// HeaderFooterVisible: boolean;
// HeaderOnEachPage: boolean;
// HorizontalScaleVisible: boolean;
// Margins: number[];
// Portrait: boolean;
// VerticalScaleVisible: boolean;
// ScaleHeaderFooter?: boolean;
// HeaderFooter?: ItemHeaderFooter[];

export const SET_SUBSCRIBTIONS = "SET_SUBSCRIPTIONS";

export interface setSubscribtions {
  type: typeof SET_SUBSCRIBTIONS;
  subscribtions: any;
}

export const SET_LIST_OF_VIEWS = "SET_LIST_OF_VIEWS";

export interface setListOfViews {
  type: typeof SET_LIST_OF_VIEWS;
  list_of_views: any;
}

export const SET_SELECTED_SUBSCRIPTION = "SET_SELECTED_SUBSCRIPTION";

export interface setSelectedSubscription {
  type: typeof SET_SELECTED_SUBSCRIPTION;
  code: string | null;
}

export type reportActions =
  | setReport
  | setReportType
  | setTabItem
  | setTabs
  | setDashboard
  | getDimFilter
  | setDashboardMetadata
  | setDataToTab
  | setCubeSession
  | setReportCaption
  | setReportStyle
  | setPrintPageProps
  | getReportLayouts
  | resetReport
  | setCurrentLayout
  | setLayoutCubeSession
  | setSubscribtions
  | setListOfViews
  | setSelectedSubscription;

//filters
export const SET_FILTERS_OF_VIEW = "SET_FILTERS_OF_VIEW";

export interface setFiltersOfView {
  type: typeof SET_FILTERS_OF_VIEW;
  filters: any;
}

export const SET_SELECTED_FILTER = "SET_SELECTED_FILTER";

export interface setSelectedFilter {
  type: typeof SET_SELECTED_FILTER;
  index: number;
}

export const SET_FILTER_STATE = "SET_FILTER_STATE";

export interface setFilterState {
  type: typeof SET_FILTER_STATE;
  expanded: boolean;
}

export const SET_FILTER_ITEMS = "SET_FILTER_ITEMS";

export interface setFilterItems {
  type: typeof SET_FILTER_ITEMS;
  items: any;
}

export const SET_CHECKED_ITEMS = "SET_CHECKED_ITEMS";

export interface setCheckedItems {
  type: typeof SET_CHECKED_ITEMS;
  checked: any;
}

export const SET_MULTIPLE_VALUES = "SET_MULTIPLE_VALUES";

export interface setMultipleValues {
  type: typeof SET_MULTIPLE_VALUES;
  multiple: boolean;
}

export const SET_FULL_FILTER_HIERARCHY = "SET_FULL_FILTER_HIERARCHY";

export interface setFullFilterHierarchy {
  type: typeof SET_FULL_FILTER_HIERARCHY;
  hierarchy: any;
}

export type filterActions =
  | setFiltersOfView
  | setSelectedFilter
  | setFilterState
  | setFilterItems
  | setCheckedItems
  | setMultipleValues
  | setFullFilterHierarchy;

//Items
export const SET_ITEMS = "SET_ITEMS";

export interface setItems {
  type: typeof SET_ITEMS;
  items: any;
}

export type AppActions =
  | setAuthedUser
  | setLoggedIn
  | setLoggedOut
  | setBreadcrumbs
  | setChartsData
  | resetChartsData
  | setLanguage
  | setLanguages
  | setLoading
  | resetLoading
  | setProject
  | setSolutionFolder
  | setSolution
  | setUniqueID
  | setUniqueTreeID
  | saveScreen
  | toggleFolder
  | setActiveTab
  | setItems
  | setReport
  | setReportType
  | setTabItem
  | setTabs
  | setDashboard
  | setDashboardMetadata
  | getDimFilter
  | setView
  | setDataToTab
  | setCubeSession
  | setCubeSessionId
  | setFiltersOfView
  | setSelectedFilter
  | setFilterState
  | setFilterItems
  | setCheckedItems
  | setMultipleValues
  | setFullFilterHierarchy
  | setReportCaption
  | setReportStyle
  | setProjectStylesheet
  | setPrintPageProps
  | getReportLayouts
  | resetReport
  | setCurrentLayout
  | setLayoutCubeSession
  | setUserName
  | setSubscribtions
  | setListOfViews
  | setSelectedSubscription;
