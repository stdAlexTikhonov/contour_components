import { SET_PROJECT_STYLESHEET, AppActions } from "../types/actions";

export const project = (state = { stylesheet: null }, action: AppActions) => {
  switch (action.type) {
    case SET_PROJECT_STYLESHEET:
      return {
        stylesheet: action.stylesheet,
      };
    default:
      return state;
  }
};
