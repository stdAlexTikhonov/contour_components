import { SET_ITEMS, setItems } from "../types/actions";

export const items = (state = [], action: setItems) => {
  switch (action.type) {
    case SET_ITEMS:
      return action.items;
    default:
      return state;
  }
};
