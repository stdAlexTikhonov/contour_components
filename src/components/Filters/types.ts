import { DataForQuery } from "../../utils/types";

export type Props = {
  show: boolean;
  position: POSITIONS_TYPE;
  facts: any;
  slice: string;
  view: string;
  filters: any;
  visibleFacts: any;
  report?: string;
  multipleFacts: boolean;
};

export type POSITIONS_TYPE =
  | "column"
  | "row"
  | "column-reverse"
  | "row-reverse";

export type IProps = Props & LinkStateToProps;

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  cube_session: string | undefined;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}
