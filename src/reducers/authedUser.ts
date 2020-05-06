export default function authedUser(state = { logged_in: false }, action) {
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
    default:
      return state;
  }
}
