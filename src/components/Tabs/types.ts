import { DataForQuery } from "../../utils/types";
import { Tab } from "../../types/actions";

export interface Props {}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  tabs: Tab[] | null;
  session: string | undefined;
  language: string;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery, index: number) => void;
}
