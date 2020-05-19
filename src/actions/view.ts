import { AppActions, SET_VIEW } from "../types/actions";

export const setView = (view: string): AppActions => ({
  type: SET_VIEW,
  view,
});
