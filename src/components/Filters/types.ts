import { Metadata, DimFilter } from "../../types/actions";
import { DataForQuery } from "../../utils/types";

export interface Props {
  metadata: Metadata;
}

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  selected_filter: DimFilter | null;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;
