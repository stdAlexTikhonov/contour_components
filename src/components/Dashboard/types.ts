import { Dashboard } from "../../types/actions";

export interface Props {}

export type IProps = Props & LinkStateToProps;

export interface LinkStateToProps {
  dashboard: Dashboard | null;
}
