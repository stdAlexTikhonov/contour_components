import { AppActions } from "../../types/actions";

export interface Props {}

export type IProps = Props & LinkStateProps & LinkDispatchProps;

export interface LinkStateProps {
  loading: boolean;
  languages: { [index: string]: string };
  logged_in: boolean;
  current: string;
  name: null | string;
}

export interface LinkDispatchProps {
  getInitialData: () => void;
  changeLanguage: (lang: string) => AppActions;
  handleLogout: () => void;
}
