import { getSession, getLanguages } from "../utils/api";
import { Dispatch } from "redux";
import { AppActions } from "../types/actions";
import { AppState } from "../store/config_store";
import { setAuthedUser, setLoggedIn } from "./authedUser";
import { setLoading, resetLoading } from "./loading";
import { setLanguages } from "./languages";
import { transform_languages_data } from "../utils/helpers";

export const handleInitialData = () => async (
  dispatch: (action: AppActions) => Dispatch<AppActions>,
  getState: () => AppState
) => {
  const state = getState();
  dispatch(setLoading());
  const { session, logged_in } = await getSession();

  logged_in && dispatch(setLoggedIn());
  dispatch(setAuthedUser(session));

  //Languages
  const langs = await getLanguages(session);
  const langs_transformed = transform_languages_data(langs.languages);
  dispatch(setLanguages(langs_transformed));

  // //Data
  // const data = await getData({
  //   method: ITEMS,
  //   session,
  // });

  // if (data.success) {
  //   dispatch(setItems(data.items));
  // }

  dispatch(resetLoading());
};
