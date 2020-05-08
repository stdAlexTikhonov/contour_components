import { languageType } from "../types/reducers";
import {
  SET_LANGUAGE,
  SET_LANGUAGES,
  languageActionTypes,
} from "../types/actions";

const languageDefaultState: languageType = {
  current: "en",
};

export const languages = (
  state = languageDefaultState,
  action: languageActionTypes
) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        current: action.language,
      };
    case SET_LANGUAGES:
      return {
        ...state,
        ...action.languages,
      };
    default:
      return state;
  }
};
