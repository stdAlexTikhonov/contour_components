export type Props = {
  checked: string[];
  direction:
    | "column"
    | "row"
    | "column-reverse"
    | "row-reverse"
    | "-moz-initial"
    | "inherit"
    | "initial"
    | "revert"
    | "unset"
    | undefined;
  handleRadio: any;
  handleToggle: any;
  button: boolean;
  multiple: boolean;
};

export type IProps = Props & LinkStateToProps;

export interface LinkStateToProps {
  filter_items: any[];
}
