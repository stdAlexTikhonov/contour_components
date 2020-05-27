import { DataForQuery } from "../../utils/types";
import { Metadata, Tab } from "../../types/actions";
export interface Props {}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  items: any;
  session: string | undefined;
  language: string;
  report: string | null;
  report_type: string | null;
  tab_item: string | null;
  tabs: Tab[] | null;
  metadata: Array<Metadata> | null;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}
