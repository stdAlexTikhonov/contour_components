import { DataForQuery } from "../../utils/types";
export interface Props {}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  items: any;
  session: string | undefined;
  language: string;
  report: string | null;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}
