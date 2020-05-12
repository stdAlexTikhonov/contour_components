import { AppActions, SET_ITEMS } from "../types/actions";

export const setItems = (items: any): AppActions => ({
  type: SET_ITEMS,
  items,
});
