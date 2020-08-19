import { DataForQuery } from "../../utils/types";

export interface Props {
  label?: string;
}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  report: string | null;
  layouts: any;
}

export interface LinkDispatchToProps {
  setLayout: (data_for_query: DataForQuery) => void;
}
