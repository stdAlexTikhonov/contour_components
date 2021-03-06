import { DataForQuery } from "../../utils/types";

export interface Props {}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  selected_subscription: string | null;
  subscriptions: any;
  session: string | undefined;
  language: string;
  report: string | null;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
  selectSubscription: (code: string) => void;
}
