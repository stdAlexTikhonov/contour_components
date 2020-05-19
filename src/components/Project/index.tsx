import React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, IProps } from "./types";
import { Cards } from "../Cards";
import { FoldersNavigator } from "../Tree";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  view: state.view,
});

export const ProjectComponent: React.FC<IProps> = ({ view }) => {
  switch (view) {
    case "tree":
      return <FoldersNavigator />;
    case "tree_only":
      return <FoldersNavigator />;
    default:
      return <Cards />;
  }
};

export const Project = connect(mapStateToProps)(ProjectComponent);
