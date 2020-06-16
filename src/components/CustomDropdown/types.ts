export interface Props {
  items: any[];
  label: string;
  multy: boolean;
  selected: any[];
  _async: boolean;
  code?: string;
  slice?: string;
  view?: string;
  report?: string;
  descending?: boolean;
}

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
}

export type IProps = Props & LinkStateToProps;
