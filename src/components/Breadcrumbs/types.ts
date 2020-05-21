import { Breadcrumb } from "../../types/actions";

interface Props {}

export interface LinkStateToProps {
  breadcrumbs: Array<Breadcrumb>;
}

export type IProps = Props & LinkStateToProps;
