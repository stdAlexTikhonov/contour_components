import { DataForQuery } from "../../utils/types";

export interface Props {}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  report: string | null;
  layouts: any;
  current_layout: string | null;
}

export interface LinkDispatchToProps {
  setLayout: (data_for_query: DataForQuery, layouts?: any) => void;
  resetReport: () => void;
  setDefault: (layouts: any) => void;
}
