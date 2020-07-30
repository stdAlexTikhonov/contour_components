import {
  SET_FILTERS_OF_VIEW,
  filterActions,
  SET_SELECTED_FILTER,
  SET_FILTER_STATE,
  SET_FILTER_ITEMS,
  SET_CHECKED_ITEMS,
  SET_MULTIPLE_VALUES,
  SET_FULL_FILTER_HIERARCHY,
} from "../types/actions";

export const filters = (
  state = {
    filters: [],
    selected_filter: -1,
    expanded: false,
    items: [],
    checked: [],
    multiple: false,
    hierarchy: {},
  },
  action: filterActions
) => {
  switch (action.type) {
    case SET_FILTERS_OF_VIEW:
      return {
        ...state,
        filters: action.filters,
      };
    case SET_SELECTED_FILTER:
      return {
        ...state,
        selected_filter: action.index,
      };
    case SET_FILTER_STATE:
      return {
        ...state,
        expanded: action.expanded,
      };
    case SET_FILTER_ITEMS:
      return {
        ...state,
        items: action.items,
      };
    case SET_CHECKED_ITEMS:
      return {
        ...state,
        checked: action.checked,
      };
    case SET_MULTIPLE_VALUES:
      return {
        ...state,
        multiple: action.multiple,
      };
    case SET_FULL_FILTER_HIERARCHY:
      return {
        ...state,
        hierarchy: action.hierarchy,
      };
    default:
      return state;
  }
};
