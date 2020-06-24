import { AppActions, SET_CUBE_SESSION_ID } from "../types/actions";

export const setCubeSessionId = (
  cube_id: string,
  cube_session: string
): AppActions => ({
  type: SET_CUBE_SESSION_ID,
  cube_id,
  cube_session,
});
