export type Props = {
  filter_items: any;
  multiple: boolean;
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
};

export type IProps = Props;
