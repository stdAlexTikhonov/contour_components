import { AppActions, SET_LOADING, RESET_LOADING } from "../types/actions";

export const setLoading = (): AppActions => ({
  type: SET_LOADING,
});

export const resetLoading = (): AppActions => ({
  type: RESET_LOADING,
});
