import { Metadata, DimFilter } from "../../types/actions";
import { DataForQuery } from "../../utils/types";

export interface Props {
  slice: string;
  view: string;
  filters: any;
  facts: any;
}

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  selected_filter: DimFilter | null;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
  handleClose: () => void;
}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;
