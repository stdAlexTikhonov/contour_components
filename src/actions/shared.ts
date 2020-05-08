import { getSession, getData, getLanguages } from "../utils/api";
import { Dispatch } from "redux";
import { AppActions } from "../types/actions";
import { AppState } from "../store/config_store";
import { setAuthedUser, setLoggedIn } from "./authedUser";
import { setLoading, resetLoading } from "./loading";
import { setLanguages } from "./languages";
import { ITEMS } from "../utils/constants";
import { transform_languages_data } from "../utils/helpers";

export const handleInitialData = () => async (
  dispatch: (action: AppActions) => Dispatch<AppActions>,
  getState: () => AppState
) => {
  dispatch(setLoading());
  const { session, logged_in } = await getSession();

  logged_in && dispatch(setLoggedIn());
  dispatch(setAuthedUser(session));

  //Languages
  const langs = await getLanguages(session);
  const langs_transformed = transform_languages_data(langs.languages);
  dispatch(setLanguages(langs_transformed));

  //Data
  const data = await getData({
    method: ITEMS,
    session,
  });

  dispatch(resetLoading());
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
