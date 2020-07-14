import {
  AppActions,
  SET_FILTERS_OF_VIEW,
  SET_SELECTED_FILTER,
} from "../types/actions";

export const setFilterOfView = (filters: any): AppActions => ({
  type: SET_FILTERS_OF_VIEW,
  filters,
});

export const setSelectedFilter = (index: number): AppActions => ({
  type: SET_SELECTED_FILTER,
  index,
});
