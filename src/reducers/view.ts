import { SET_VIEW, setView } from "../types/actions";

export const view = (state = false, action: setView) => {
  switch (action.type) {
    case SET_VIEW:
      return action.view;
    default:
      return state;
  }
};
