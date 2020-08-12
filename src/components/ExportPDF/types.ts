import { DataForQuery } from "../../utils/types";
import { pringPage } from "../../types/reducers";
export interface Props {}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  report: string | null;
  print_page: pringPage | null;
}

export interface LinkDispatchToProps {
  handleDataQuery: (data_for_query: DataForQuery) => void;
}

export interface LinkStateToPropsTabs {
  print_page: any;
}

export interface DialogProps {
  onExport: () => void;
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export interface LinkDispatchToPropsTabs {
  settingPrintPage: (props: pringPage) => void;
}

export type TabProps = LinkStateToPropsTabs & LinkDispatchToPropsTabs;
