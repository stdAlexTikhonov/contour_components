import { DataForQuery } from "../../utils/types";

export interface Props {
  slice: string;
  view: string;
  visibleFacts: any;
  items: any;
}

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}

export type IProps = Props & LinkStateToProps;
