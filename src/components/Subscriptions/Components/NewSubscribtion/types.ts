import { DataForQuery } from "../../../../utils/types";

export interface Props {
  code_?: string;
  caption_?: string;
  format_?: string;
  isPrivate_?: boolean;
  periodicity_?: any;
  emails_?: string;
  users_?: string;
  edit: boolean;
}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  report: string | null;
  list_of_views: any;
  selected_subscription: null | string;
  tabs: any;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}
