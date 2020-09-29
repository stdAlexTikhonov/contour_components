import { AppActions } from "../../types/actions";

export interface IProps {
  languages: { [index: string]: string };
  logged_in: boolean;
  changeLanguage: (lang: string) => AppActions;
  currentLanguage: string;
}
