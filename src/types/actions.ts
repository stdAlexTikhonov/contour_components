//User actions
export const SET_AUTHED_USER = "SET_AUTHED_USER";
export const SET_LOGGED_IN = "SET_LOGGED_IN";
export const SET_LOGGED_OUT = "SET_LOGGED_OUT";

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

export type authedUserActionTypes = setAuthedUser | setLoggedIn | setLoggedOut;

//Breadcrumbs actions
export const ADD_BREADCRUMB = "ADD_BREADCRUMB";
export const SLICE_BREADCRUMBS = "SLICE_BREADCRUMBS";

export interface addBreadcrumb {
  type: typeof ADD_BREADCRUMB;
  caption: string;
  link: string;
}

export interface sliceBreadcrumbs {
  type: typeof SLICE_BREADCRUMBS;
  ind: number;
}

export type breadcrumbsActionTypes = addBreadcrumb | sliceBreadcrumbs;

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

export type reportActions = setReport | setReportType;

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
  | addBreadcrumb
  | sliceBreadcrumbs
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
  | setView;
