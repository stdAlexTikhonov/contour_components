import { DataForQuery } from "../../utils/types";

export type Props = {
  show: boolean;
  position: POSITIONS_TYPE;
  facts: any;
  slice: string;
  view: string;
  filters: any;
  columns: any;
  rows: any;
  attributes: any;
  index: number;
};

export type POSITIONS_TYPE =
  | "column"
  | "row"
  | "column-reverse"
  | "row-reverse";

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  cube_session: string | undefined;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
  handleUpdateFilters: (filters: any, index: number) => void;
}
