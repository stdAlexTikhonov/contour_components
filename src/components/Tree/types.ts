export interface Props {}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  items: any;
  session: string | undefined;
  language: string;
}

export interface LinkDispatchToProps {
  handleReportClick: (code: string) => void;
}
