import {
  SET_LOADING,
  RESET_LOADING,
  loadingActionTypes,
} from "../types/actions";

export const loading = (state = false, action: loadingActionTypes) => {
  switch (action.type) {
    case SET_LOADING:
      return true;
    case RESET_LOADING:
      return false;
    default:
      return state;
  }
};
