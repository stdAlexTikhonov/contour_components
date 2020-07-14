import { AppActions, SET_FILTERS_OF_VIEW } from "../types/actions";

export const setFilterOfView = (filters: any): AppActions => ({
  type: SET_FILTERS_OF_VIEW,
  filters,
});
