export interface Props {}

export type IProps = Props & LinkStateToProps;

export interface LinkStateToProps {
  items: any;
  session: string | undefined;
  language: string;
  report: string | null;
}
