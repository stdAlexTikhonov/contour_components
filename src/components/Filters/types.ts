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
  chart: any;
  filterChange: any;
  meta_index: number;
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
  filter_index: (index: number) => number;
  filter_expanded: (index: number) => any;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}
