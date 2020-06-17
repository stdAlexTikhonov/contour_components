import { Metadata } from "../../types/actions";

export interface Props {
  metadata: Metadata;
}

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
}

export type IProps = Props & LinkStateToProps;

// export interface LinkStateToProps {
//   items: any;
//   session: string | undefined;
//   language: string;
//   report: string | null;
//   report_type: string | null;
//   tab_item: string | null;
//   tabs: [] | null;
//   metadata: Array<Metadata> | null;
// }

// export interface LinkDispatchToProps {
//   handleDataQuery: (data_for_query: DataForQuery) => void;
// }
