import { DataForQuery } from "../../utils/types";
import { Metadata, Tab, Dashboard } from "../../types/actions";
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
  dashboard: Dashboard | null;
  report_caption: string;
  report_stylesheet: any;
  project_stylesheet: any;
  logged_in: boolean;
  layouts: any;
  subscribtions: any;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}
