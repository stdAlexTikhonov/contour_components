import { DataForQuery } from "../../utils/types";

export type Props = {
  show: boolean;
  position: POSITIONS_TYPE;
  facts: any;
  slice: string;
  view: string;
  filters: any;
  visibleFacts: any;
  report?: string;
  multipleFacts: boolean;
  chart: any;
  filterChange: any;
  meta_index: number;
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
}

export interface LinkDispatchToProps {
  settingCubeSession: (cube_id: string, cube_session: string) => void;
}
