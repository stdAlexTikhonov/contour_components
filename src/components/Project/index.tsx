import React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store/config_store";
import { LinkStateToProps, IProps } from "./types";
import { Cards } from "../Cards";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  view: state.view,
});

export const ProjectComponent: React.FC<IProps> = ({ view }) => {
  switch (view) {
    case "tree":
      return <div>tree</div>;
    case "tree_only":
      return <div>tree only</div>;
    default:
      return <Cards />;
  }
};

export const Project = connect(mapStateToProps)(ProjectComponent);
