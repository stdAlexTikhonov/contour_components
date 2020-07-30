import { connect } from "react-redux";
import { DemoComponent } from "./HierarchyComponent.jsx";
import { LinkStateToProps } from "./type";
import { AppState } from "../../store/config_store";

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  hierarchy: state.filters.hierarchy,
});

export const Hierarchy = connect(mapStateToProps)(DemoComponent);
