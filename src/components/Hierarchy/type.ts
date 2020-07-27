export interface Props {
  label: string;
}

export type IProps = Props & LinkStateToProps;

export interface LinkStateToProps {
  hierarchy: any;
}
