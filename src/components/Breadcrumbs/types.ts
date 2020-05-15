import { breadcrumb } from "../../types/reducers";

interface Props {}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  breadcrumbs: breadcrumb[];
}

export interface LinkDispatchToProps {
  handleClick: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    index: number
  ) => void;
}
