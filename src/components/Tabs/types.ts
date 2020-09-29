import { DataForQuery } from "../../utils/types";
import { Metadata, Tab, Dashboard } from "../../types/actions";

export interface Props {
  tabs: Tab[] | null;
}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  metadata: Array<Metadata> | null;
  dashboard: Dashboard | null;
  report: string | null;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery, index: number) => void;
  handleListOfViews: (list_of_you: any) => void;
  resetDashboard: () => void;
}
