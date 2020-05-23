import { RouteComponentProps } from "react-router-dom";

export interface Props {}

export type IProps = Props &
  LinkStateToProps &
  LinkDispatchToProps &
  RouteComponentProps;

export interface LinkStateToProps {
  items: any;
  session: string | undefined;
  language: string;
  view: string;
}

export interface LinkDispatchToProps {
  handleReportClick: (code: string) => void;
}
