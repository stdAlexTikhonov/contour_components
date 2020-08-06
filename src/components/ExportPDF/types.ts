import { DataForQuery } from "../../utils/types";
import { pringPage } from "../../types/reducers";
export interface Props {}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  report: string | null;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}

export interface LinkStateToPropsTabs {
  print_page: pringPage | null;
}
