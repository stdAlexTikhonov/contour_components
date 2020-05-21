import { AppActions, SET_BREADCRUMBS, Breadcrumb } from "../types/actions";

export const setBreadcrumbs = (breadcrumbs: Array<Breadcrumb>): AppActions => ({
  type: SET_BREADCRUMBS,
  breadcrumbs,
});
