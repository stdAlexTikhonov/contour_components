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
  filter_index: number;
  f_checked: string[];
  cube_id: string;
  setMultyExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setExpandChecked: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface LinkStateToProps {
  session: string | undefined;
  language: string;
  cube_session: string | undefined;
  cubes: any;
  selected_filter: number;
  expanded: boolean;
}

export interface LinkDispatchToProps {
  settingCubeSession: (cube_id: string, cube_session: string) => void;
  settingSelectedFilter: (index: number) => void;
  settingFilterState: (expanded: boolean) => void;
  settingFilterItems: (items: any[]) => void;
}

export type IProps = Props & LinkStateToProps & LinkDispatchToProps;
