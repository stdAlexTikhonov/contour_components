import { AppActions, SET_PROJECT_STYLESHEET } from "../types/actions";

export const setProjectStylesheet = (stylesheet: any): AppActions => ({
  type: SET_PROJECT_STYLESHEET,
  stylesheet,
});
