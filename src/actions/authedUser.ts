import {
  AppActions,
  SET_AUTHED_USER,
  SET_LOGGED_IN,
  SET_LOGGED_OUT,
} from "../types/actions";

export const setAuthedUser = (id: string): AppActions => ({
  type: SET_AUTHED_USER,
  id,
});

export const setLoggedIn = (): AppActions => ({
  type: SET_LOGGED_IN,
});

export const setLoggedOut = (): AppActions => ({
  type: SET_LOGGED_OUT,
});
