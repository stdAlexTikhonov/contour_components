import { AppActions, SET_LANGUAGES, SET_LANGUAGE } from "../types/actions";

export const setLanguage = (language: string): AppActions => ({
  type: SET_LANGUAGE,
  language,
});

export const setLanguages = (languages: {
  [index: string]: string;
}): AppActions => ({
  type: SET_LANGUAGES,
  languages,
});
