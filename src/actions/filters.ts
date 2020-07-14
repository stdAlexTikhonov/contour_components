import {
  AppActions,
  SET_FILTERS_OF_VIEW,
  SET_SELECTED_FILTER,
  SET_FILTER_STATE,
  SET_FILTER_ITEMS,
  SET_CHECKED_ITEMS,
} from "../types/actions";

export const setFilterOfView = (filters: any): AppActions => ({
  type: SET_FILTERS_OF_VIEW,
  filters,
});

export const setSelectedFilter = (index: number): AppActions => ({
  type: SET_SELECTED_FILTER,
  index,
});

export const setFilterState = (expanded: boolean): AppActions => ({
  type: SET_FILTER_STATE,
  expanded,
});

export const setFilterItems = (items: any): AppActions => ({
  type: SET_FILTER_ITEMS,
  items,
});

export const setCheckedItems = (checked: any): AppActions => ({
  type: SET_CHECKED_ITEMS,
  checked,
});
