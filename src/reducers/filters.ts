import {
  SET_FILTERS_OF_VIEW,
  filterActions,
  SET_SELECTED_FILTER,
  SET_FILTER_STATE,
} from "../types/actions";

export const filters = (
  state = { filters: [], selected_filter: -1, expanded: false },
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
    default:
      return state;
  }
};
