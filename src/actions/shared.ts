import { getSession, userLogin } from "../utils/api";
import { Dispatch } from "redux";
import { AppActions } from "../types/actions";
import { AppState } from "../store/config_store";
import { setAuthedUser, setLoggedIn } from "./authedUser";

export const handleInitialData = () => async (
  dispatch: (action: AppActions) => Dispatch<AppActions>,
  getState: () => AppState
) => {
  let _session = await getSession();

  if (_session === null) {
    const { session } = await userLogin({
      user: "guest",
      password: "guest",
    });
    _session = session;
    dispatch(setAuthedUser(session));
  } else {
    dispatch(setAuthedUser(_session));
    dispatch(setLoggedIn());
  }

  // const uniqueID = generateUID();
  // dispatch(setUniqueID(uniqueID));
  // dispatch(setLoading());
  // return getSession()
  //   .then((session) => {
  //     //Если сессия не сохранена создаём гостевую сессию
  //     if (session === null) {
  //       return getGuest().then(({ session }) => {
  //         dispatch(setAuthedUser(session));
  //         return getInitialData(session);
  //       });
  //     } else {
  //       dispatch(setLoggedIn());
  //       dispatch(setAuthedUser(session));
  //       return getInitialData(session);
  //     }
  //   })
  //   .then((solutions) => {
  //     const {
  //       navigation: { session },
  //     } = getState();
  //     if (solutions.success && solutions.items.length > 0) {
  //       solutions.items.forEach((item) => (item.id = generateUID()));
  //       dispatch(saveScreen({ items: solutions.items, id: uniqueID }));
  //       dispatch(addBreadcrumb("Home", uniqueID, null));
  //     } else {
  //       const { authedUser } = getState();
  //       if (authedUser.logged_in)
  //         alert("Information is not avalible for current user.");
  //       else alert("You have to log in.");
  //     }
  //     return session;
  //   })
  //   .then((session) => getLanguages(session))
  //   .then((languages) => {
  //     dispatch(setLanguages(languages.languages));
  //     dispatch(resetLoading());
  //   });
};
