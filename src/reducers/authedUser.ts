import { authedUserType } from "../types/reducers";
import {
  authedUserActionTypes,
  SET_AUTHED_USER,
  SET_LOGGED_OUT,
  SET_LOGGED_IN,
  SET_USER_NAME,
} from "../types/actions";

const authedUserDefaultState: authedUserType = {
  logged_in: false,
  session: null,
  name: null,
};

export const authedUser = (
  state = authedUserDefaultState,
  action: authedUserActionTypes
): authedUserType => {
  switch (action.type) {
    case SET_AUTHED_USER:
      return {
        ...state,
        [`session`]: action.id,
      };
    case SET_LOGGED_IN:
      return {
        ...state,
        [`logged_in`]: true,
      };
    case SET_LOGGED_OUT:
      return {
        ...state,
        [`logged_in`]: false,
      };
    case SET_USER_NAME:
      return {
        ...state,
        name: action.name,
      };
    default:
      return state;
  }
};
