import {
  AppActions,
  SET_AUTHED_USER,
  SET_LOGGED_IN,
  SET_LOGGED_OUT,
  SET_USER_NAME,
} from "../types/actions";

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

export const setUserName = (
  name: string,
  first_name: string,
  last_name: string,
  email: string
): AppActions => ({
  type: SET_USER_NAME,
  name,
  first_name,
  last_name,
  email,
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
