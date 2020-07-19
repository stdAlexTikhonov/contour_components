import React from "react";
import { connect } from "react-redux";
import { DemoComponent } from "./DemoTableComponent.jsx";

const mapStateToProps = (state) => ({
  hierarchy: state.filters.hierarchy,
});

export const Demo = connect(mapStateToProps)(DemoComponent);
