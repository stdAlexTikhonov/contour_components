import { DataForQuery } from "../../utils/types";

export interface Props {
  title: string;
  items: any;
  code: string;
  slice: string;
  view: string;
  facts?: boolean;
  visibleFacts?: any;
}

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  cube_session: string | undefined;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;
