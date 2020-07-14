import { SET_FILTERS_OF_VIEW, setFiltersOfView } from "../types/actions";

export const filters = (state = {}, action: setFiltersOfView) => {
  switch (action.type) {
    case SET_FILTERS_OF_VIEW:
      return {
        ...state,
        filters: action.filters,
      };
    default:
      return state;
  }
};
