import { getSession, getLanguages, getLanguage } from "../utils/api";
import { Dispatch } from "redux";
import { AppActions } from "../types/actions";
import { AppState } from "../store/config_store";
import { setAuthedUser, setLoggedIn, setUserName } from "./authedUser";
import { setLoading, resetLoading } from "./loading";
import { setLanguages, setLanguage } from "./languages";
import { transform_languages_data } from "../utils/helpers";

export const handleInitialData = () => async (
  dispatch: (action: AppActions) => Dispatch<AppActions>,
  getState: () => AppState
) => {
  dispatch(setLoading());
  const {
    session,
    logged_in,
    first_name,
    last_name,
    name,
    email,
  } = await getSession();

  logged_in && dispatch(setLoggedIn());
  dispatch(setAuthedUser(session));
  dispatch(setUserName(name, first_name, last_name, email));
  //Languages
  const langs = await getLanguages(session);
  const langs_transformed = transform_languages_data(langs.languages);
  dispatch(setLanguages(langs_transformed));
  const language = getLanguage();
  if (language) dispatch(setLanguage(language));

  dispatch(resetLoading());
};
