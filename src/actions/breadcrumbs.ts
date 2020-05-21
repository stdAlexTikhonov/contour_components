import {
  AppActions,
  ADD_BREADCRUMB,
  SLICE_BREADCRUMBS,
} from "../types/actions";

export const addBreadcrumb = (caption: string, link: string): AppActions => ({
  type: ADD_BREADCRUMB,
  caption,
  link,
});

export const sliceBreadcrumbs = (ind: number): AppActions => ({
  type: SLICE_BREADCRUMBS,
  ind,
});
