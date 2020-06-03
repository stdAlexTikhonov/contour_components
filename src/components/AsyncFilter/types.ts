import { DataForQuery } from "../../utils/types";
import { DimFilter } from "../../types/actions";

export interface Props {
  label: string;
  code: string;
  slice: string;
  view: string;
}

export type dataType = {
  captions: string[];
  filters: string;
};

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  selected_filter: DimFilter | null;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => Promise<dataType>;
  resetSelectedFilter: () => void;
}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;
