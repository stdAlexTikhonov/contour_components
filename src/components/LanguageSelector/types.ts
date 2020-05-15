import { AppActions } from "../../types/actions";

export interface IProps {
  items: string[];
  changeLanguage: (lang: string) => AppActions;
  language: string;
  languages: { [index: string]: string };
}
