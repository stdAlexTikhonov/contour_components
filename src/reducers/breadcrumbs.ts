import {
  breadcrumbsActionTypes,
  ADD_BREADCRUMB,
  SLICE_BREADCRUMBS,
} from "../types/actions";

import { breadcrumb } from "../types/reducers";

export const breadcrumbs = (
  state: breadcrumb[] = [],
  action: breadcrumbsActionTypes
) => {
  switch (action.type) {
    case ADD_BREADCRUMB:
      return [
        ...state.concat({
          caption: action.caption,
          link: action.link,
        }),
      ];
    case SLICE_BREADCRUMBS:
      return [...state.slice(0, action.ind)];
    default:
      return state;
  }
};
