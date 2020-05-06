import {
  saveSession,
  userLogin,
  getData,
  removeSession,
  userRegister,
} from "../utils/api";
import {
  AppActions,
  SET_AUTHED_USER,
  SET_LOGGED_IN,
  SET_LOGGED_OUT,
} from "../types/actions";
// import { generateUID } from "../utils/helpers";
// import { saveScreen } from "../actions/screens";
// import { handleInitialData } from "./shared";
// import { setLoading, resetLoading } from "./loading";

export const setAuthedUser = (id: string): AppActions => ({
  type: SET_AUTHED_USER,
  id,
});

export const setLoggedIn = (): AppActions => ({
  type: SET_LOGGED_IN,
});

export const setLoggedOut = (): AppActions => ({
  type: SET_LOGGED_OUT,
});

// export function handleLogin(login, password) {
//   return (dispatch) => {
//     dispatch(setLoading());
//     return userLogin(login, password)
//       .then((data) => {
//         if (data.success) {
//           dispatch(setAuthedUser(data.session));
//           saveSession(data.session);
//           return getInitialData(data.session);
//         } else if (data.error.code === 1001) {
//           alert("Mistake in login or password!");
//           dispatch(handleInitialData());
//         }
//       })
//       .then((solutions) => {
//         dispatch(saveScreen({ items: solutions.items, id: generateUID() }));
//         dispatch(setLoggedIn());
//       })
//       .then(() => {
//         dispatch(resetLoading());
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   };
// }

// export function handleRegister(user_info) {
//   return (dispatch) => {
//     dispatch(setLoading());
//     return userRegister(user_info).then((data) => {
//       console.log(data);
//       dispatch(resetLoading());
//     });
//   };
// }

// export function handleLogout() {
//   return (dispatch) => {
//     dispatch(setAuthedUser(null));
//     dispatch(setLoggedOut());
//     removeSession();
//   };
// }
