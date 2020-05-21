import { setBreadcrumbs, SET_BREADCRUMBS, Breadcrumb } from "../types/actions";

export const breadcrumbs = (
  state: Array<Breadcrumb> = [],
  action: setBreadcrumbs
) => {
  switch (action.type) {
    case SET_BREADCRUMBS:
      return action.breadcrumbs;
    default:
      return state;
  }
};
