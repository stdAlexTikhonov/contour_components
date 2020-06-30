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
  filterChange: any;
  meta_index: number;
}

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  cube_session: string | undefined;
  cubes: any;
}

export interface LinkDispatchToProps {
  settingCubeSession: (cube_id: string, cube_session: string) => void;
  settingExpandedFilter: (expanded_filter: any, index: number) => void;
}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;
