import { DataForQuery } from "../../utils/types";

export type Props = {
  show: boolean;
  position: POSITIONS_TYPE;
  facts: any;
  slice: string;
  view: string;
  visibleFacts: any;
  report?: string;
  multipleFacts: boolean;
  chart: any;
  filterChange: any;
  meta_index: number;
  setMapControl: boolean;
  width: number;
  height: number;
  coords: number[];
  setCoords: any;
  filters: any;
  columns?: any;
  rows?: any;
  attributes?: any;
  grid_filters?: any;
};

export type POSITIONS_TYPE =
  | "column"
  | "row"
  | "column-reverse"
  | "row-reverse";

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  cubes: any;
  selected_filter: number;
  expanded: boolean;
  filter_items: any[];
  checked: any;
  multiple: boolean;
}

export interface LinkDispatchToProps {
  settingCubeSession: (cube_id: string, cube_session: string) => void;
  settingCheckedItems: (checked: any) => void;
}
