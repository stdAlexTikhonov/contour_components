import React from "react";
import { connect } from "react-redux";
import { CustomizedTreeView } from "./HierarchyComponent.tsx";
import { LinkStateToProps } from "./type";
import { AppState } from "../../store/config_store";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  filters: state.filters.filters,
});

export const Hierarchy = connect(mapStateToProps)(CustomizedTreeView);
