import { SET_PRINT_PAGE_PROPS, AppActions } from "../types/actions";

export const print_page = (state = null, action: AppActions) => {
  switch (action.type) {
    case SET_PRINT_PAGE_PROPS:
      return {
        ...action.print_page,
      };
    default:
      return state;
  }
};
