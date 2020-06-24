import { SET_CUBE_SESSION_ID, setCubeSessionId } from "../types/actions";

export const cubes = (state = {}, action: setCubeSessionId) => {
  switch (action.type) {
    case SET_CUBE_SESSION_ID:
      return {
        ...state,
        [`${action.cube_id}`]: action.cube_session,
      };
    default:
      return state;
  }
};
