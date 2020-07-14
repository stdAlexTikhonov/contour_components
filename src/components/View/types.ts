import { Metadata } from "../../types/actions";

export interface Props {
  metadata: Metadata;
  index: number;
}

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

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

export interface LinkDispatchToProps {
  setCurrentFilters: (filters: any) => void;
}
